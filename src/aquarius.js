const rq = require('request-promise');
const csv2json = require("csvtojson");

const winston = require('./winston');


const serverUrl = 'http://10.10.82.196/AQUARIUS/Publish/AquariusPublishRestService.svc/';
const dataSet = require('./aquarius-mapping.json');

const utils = require('./utils');

const login = async () => {
    const url = serverUrl + 'GetAuthToken';
    const params = {user: 'rbme', encPwd: 'D@ta!'};
    const response = await rq({uri: url, qs: params, encoding: null});
    return response.toString('utf8');
};


const downloadData = async (endpoint, params) => {
    const token = await login();
    const url = serverUrl + endpoint;
    params = {...params, token};
    try {
        const response = await rq({uri: url, qs: params, encoding: null});
        const responseString = response.toString('utf8');
        return await csv2json().fromString(responseString)
    } catch (error) {
        winston.log({level: 'warn', message: 'Something wired happened'});
    }
};

const form = dataSet.forms[0];
const dataElements = form.dataElements.filter(de => {
    return de.param
});

const processWaterData = async () => {
    let data = await downloadData('GetDataSetsList', {});

    let processed = [];

    dataElements.forEach(de => {
        const found = data.filter(d => {
            return d['Parameter'] === de.param;
        });
        const realData = found.map(d => {
            const val = {};
            val['Parameter'] = de.mapping.value;
            val['Category'] = 'default';
            val['Location'] = d['LocationId'];
            val['Value'] = d['EndValue'];
            // TODO calculate period dynamically
            val['Year'] = '2018July';
            return val;
        }).filter(d => {
            return d.Location;
        });
        processed = [...processed, ...realData];

    });

    const dataValues = utils.processData(dataSet, processed);

    try {
        return await utils.insertData({dataValues});
    } catch (e) {
        return e;
    }
};

processWaterData().then(response => {
    console.log(JSON.stringify(response, null, 2));
});