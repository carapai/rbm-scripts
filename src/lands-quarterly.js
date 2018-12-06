const _ = require('lodash');

const soap = require('./soap');
const utils = require('./utils');


const dataSet = require('./lands-quarterly-mapping.json');


const processQuarterly = async () => {

    // TODO calculate quarterly period based on year

    const lam07Data = await soap.getLAM07('2017Q1')['return'];
    const lam08Data = await soap.getLAM08('2017Q1')['return'];
    const lam09Data = await soap.getLAM09('2017Q1')['return'];
    const lam10Data = await soap.getLAM10('2017Q1')['return'];
    const lam24Data = await soap.getLAM24('2017Q1')['return'];
    const lam25Data = await soap.getLAM25('2017Q1')['return'];

    const allData = [...lam07Data, ...lam08Data, ...lam09Data, ...lam10Data, ...lam24Data, ...lam25Data];

    const dataValues = utils.processData(dataSet, allData);

    const processedData = _.uniqWith(dataValues, _.isEqual);

    try {
        return await utils.insertData({dataValues: processedData});
    } catch (e) {
        return e
    }
};

processQuarterly().then(response => {
    console.log(JSON.stringify(response));
});