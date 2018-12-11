const _ = require('lodash');
const moment = require('moment');
const soap = require('./soap');
const utils = require('./utils');

const dataSet = require('./lands-monthly-mapping.json');

const fmt = 'YYYYMM';
const processMonthly = async () => {
    // const period = moment().subtract(1, 'M').format(fmt);
    const period = '201803';
    try {
        const allData = await soap.getLAM12(period);
        const dataValues = utils.processData(dataSet, allData);
        const processedData = _.uniqWith(dataValues, _.isEqual);
        return allData;
        // return await utils.insertData({dataValues: processedData});
    } catch (e) {
        // console.log('Error');
        return e
    }
};

processMonthly().then(response => {
    console.log(JSON.stringify(response, null, 2));
});