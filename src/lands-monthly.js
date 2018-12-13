const _ = require('lodash');
const moment = require('moment');
const soap = require('./soap');
const utils = require('./utils');
const winston = require('./winston');
const dataSet = require('./lands-monthly-mapping.json');

let {
    fromDate,
    toDate
} = require('./options');

const fmt = 'YYYYMM';
const processMonthly = async () => {

    let periods = [];

    if (fromDate && toDate) {
        periods = utils.enumerateDates(fromDate, toDate, 'M', fmt)
    } else {
        const period = moment().subtract(1, 'M').format(fmt);
        periods = [period]
    }

    let data = [];

    try {
        const allLam12Data = periods.map(period => {
            return soap.getLAM12(period);
        });

        const lam12Data = await Promise.all(allLam12Data);


        lam12Data.forEach(d1 => {
            d1.forEach(d => {
                data = [...data, {
                    ...d,
                    organisationUnit: dataSet.organisationUnits[0]['name'],
                    categoryOptioncombo: 'default'
                }];
            });
        });

        const dataValues = utils.processData(dataSet, data);
        const processedData = _.uniqWith(dataValues, _.isEqual);
        return await utils.insertData({dataValues: processedData});
    } catch (e) {
        return e
    }
};

processMonthly().then(response => {
    winston.log({level: 'info', message: JSON.stringify(response)});
});