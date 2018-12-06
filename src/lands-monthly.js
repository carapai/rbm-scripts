const _ = require('lodash');

const soap = require('./soap');
const utils = require('./utils');

const dataSet = require('./lands-monthly-mapping.json');


const processMonthly = async () => {

    // TODO calculate monthly period based on year

    const allData = await soap.getLAM12('201701')['return'];

    const dataValues = utils.processData(dataSet, allData);

    const processedData = _.uniqWith(dataValues, _.isEqual);

    try {
        return await utils.insertData({dataValues: processedData});
    } catch (e) {
        return e
    }
};

processMonthly().then(response => {
    console.log(JSON.stringify(response, null, 2));
});