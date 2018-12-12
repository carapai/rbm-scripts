const _ = require('lodash');
const moment = require('moment');


const soap = require('./soap');
const utils = require('./utils');
const winston = require('./winston');


const dataSet = require('./lands-quarterly-mapping.json');

const fmt = 'Y[Q]Q';

let {
    fromDate,
    toDate
} = require('./options');


const processQuarterly = async () => {

    let periods = [];

    if (fromDate && toDate) {
        periods = utils.enumerateDates(fromDate, toDate, 'Q', fmt)
    } else {
        const period = moment().subtract(1, 'Q').format(fmt);
        periods = [period]
    }

    let data = [];

    console.log(periods);

    /*periods.forEach(async period => {
        try {
            const lam08Data = await soap.getLAM08(period);
            let lam09Data = await soap.getLAM09(period);
            lam09Data = lam09Data.map(d => {
                return {...d, categoryOptioncombo: 'default'}
            });
            const lam10Data = await soap.getLAM10(period);
            let lam10DataDenominator = await soap.getLAM10Denominator(period);

            lam10DataDenominator = lam10DataDenominator.map(d => {
                return {...d, categoryOptioncombo: 'default', code: 'LAM101'}
            });

            data = [...data,
                ...lam08Data,
                ...lam09Data,
                ...lam10Data,
                ...lam10DataDenominator
            ];
        } catch (e) {
            winston.log({level: 'info', message: JSON.stringify(e)});
            // return e
        }
    });*/

    console.log(data);

    /*try {
        const dataValues = utils.processData(dataSet, data);
        const processedData = _.uniqWith(dataValues, _.isEqual);
        return await utils.insertData({dataValues: processedData});
    } catch (e) {
        return e;
    }*/

};

processQuarterly().then(response => {
    winston.log({level: 'info', message: JSON.stringify(response)});
});