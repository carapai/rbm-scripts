const moment = require('moment');
const rq = require('request-promise');
const _ = require('lodash');
const minimist = require('minimist');
const fs = require("fs");
const url = require('url').URL;
const isReachable = require('is-reachable');
const winston = require('./winston');

const csv2json = require("csvtojson");

const args = minimist(process.argv.slice(2));


const username = args['dhis2-username'] || 'admin';
const password = args['dhis2-password'] || 'district';
const dhisUrl = args['dhis2-url'] || 'http://localhost:8080/dhis';

const dhis2 = new url(dhisUrl);

dhis2.username = username;
dhis2.password = password;

const baseUrl = dhis2.toString() + '/api/';

const DATA_URL = baseUrl + 'dataValueSets';


const dataSet = require('./dataSet.json');
const ouMappings = require('./orgUnitMapping.json');

// Sample data from lias
const liasSampleData = [
    {
        "Data Element": "Number of people eating fish",
        "CategoryOption Combo": "M,F",
        "Period": "201810",
        "Value": 10,
        "Organisation": "Ngelehun CHC",
        "Sex": "Male"
    }
];

const nest = (seq, keys) => {
    if (!keys.length)
        return seq;
    const first = keys[0];
    const rest = keys.slice(1);
    return _.mapValues(_.groupBy(seq, first), (value) => {
        return nest(value, rest)
    });
};


const readCSV = (url) => {
    const buffer = fs.readFileSync(url);
    return bufferToExcel(buffer);
};

const convertCSV2JSON = async csv => {
    const jsonArray = await csv2json().fromFile(csv);
    return jsonArray;
};

/*
* Read CSV file from url
* args: csv url
* return json
* */

const downloadCSV = async (url) => {
    try {
        const response = await rq({uri: url, encoding: null});
        const responseString = response.toString('utf8');
        const data = await csv2json().fromString(responseString);
        return data
    } catch (error) {
        winston.log({level: 'warn', message: 'Something wired happened'});
    }
};

const processWaterData = async () => {
    const data = await convertCSV2JSON('water.csv');

    return data.map(d => {
        const val = {};
        val['Data Element'] = 'Number of people eating fish';
        val['CategoryOption Combo'] = 'M,F';
        val['Organisation'] = ouMappings[d['LocationId']];
        val['Value'] = d['EndValue'];
        val['Period'] = '201810';
        return val;
    });
};


const insertData = data => {
    const options = {
        method: 'POST',
        uri: DATA_URL,
        body: data,
        json: true
    };
    return rq(options);
};


const processData = (dataSet, data) => {
    const forms = dataSet.forms;
    let dataValues = [];

    data = nest(data, [dataSet.dataElementColumn.value]);

    const organisations = _.fromPairs(dataSet.organisationUnits.map(o => {
        if (dataSet.orgUnitStrategy.value === 'name') {
            return [o.name, o.id];
        } else if (dataSet.orgUnitStrategy.value === 'code') {
            return [o.code, o.id];
        }
        return [o.id, o.id];
    }));

    forms.forEach(f => {
        let p = {};
        data = f.dataElements.forEach(element => {
            if (element.mapping) {
                const foundData = data[element.mapping.value];

                const groupedData = _.fromPairs(foundData.map(d => {
                    return [d[dataSet.categoryOptionComboColumn.value], {
                        period: d[dataSet.periodColumn.value],
                        value: d[dataSet.dataValueColumn.value],
                        orgUnit: d[dataSet.orgUnitColumn.value]
                    }]
                }));
                const obj = _.fromPairs([[element.id, groupedData]]);
                p = {...p, ...obj}
            }
        });
        data = p;
        if (data) {
            f.categoryOptionCombos.forEach(coc => {
                _.forOwn(coc.mapping, (mapping, dataElement) => {
                    dataValues = [...dataValues, {
                        dataElement,
                        value: data[dataElement][mapping.value]['value'],
                        period: data[dataElement][mapping.value]['period'],
                        categoryOptionCombo: coc.id,
                        orgUnit: organisations[data[dataElement][mapping.value]['orgUnit']]
                    }]
                })
            });
        }
    });

    return dataValues;

};

/*processWaterData().then(data => {
    const dataValues = processData(dataSet, data);
    console.log(dataValues)
});*/


downloadCSV('https://people.sc.fsu.edu/~jburkardt/data/csv/addresses.csv').then(data => {
    console.log(data);
})

/*

insertData({dataValues}).then(inserted => {
    console.log(inserted)
});*/





