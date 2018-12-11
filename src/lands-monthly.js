const _ = require('lodash');
const moment = require('moment');
const soap = require('./soap');
const utils = require('./utils');
const winston = require('./winston');
const dataSet = require('./lands-monthly-mapping.json');

let {
    importDate,
    fromDate,
    toDate
} = require('./options');

const fmt = 'YYYYMM';
const processMonthly = async () => {

    let period = moment(importDate) || moment();

    period = period.subtract(1, 'M').format(fmt);
    try {
        let allData = await soap.getLAM12(period);

        allData = allData.map(d => {
            return {...d, organisationUnit: dataSet.organisationUnits[0]['name'], categoryOptioncombo: 'default'}
        });

        const dataValues = utils.processData(dataSet, allData);
        const processedData = _.uniqWith(dataValues, _.isEqual);
        return await utils.insertData({dataValues: processedData});

    } catch (e) {
        return e
    }
};

processMonthly().then(response => {
    winston.log({level: 'info', message: JSON.stringify(response)});
});