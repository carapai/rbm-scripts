const _ = require('lodash');
const moment = require('moment');


const soap = require('./soap');
const utils = require('./utils');


const dataSet = require('./lands-quarterly-mapping.json');

const fmt = 'Y[Q]Q';


const processQuarterly = async () => {

    const period = moment().subtract(1, 'Q').format(fmt);

    try {
        // const lam07Data = await soap.getLAM07(period)['return'];
        const lam08Data = await soap.getLAM08(period);
        console.log(lam08Data);
        // const lam09Data = await soap.getLAM09(period)['return'];
        // const lam10Data = await soap.getLAM10(period)['return'];
        // const lam24Data = await soap.getLAM24(period)['return'];
        // const lam25Data = await soap.getLAM25(period)['return'];
        const allData = [
            // ...lam07Data,
            ...lam08Data,
            // ...lam09Data,
            // ...lam10Data,
            // ...lam24Data,
            // ...lam25Data
        ];
        const dataValues = utils.processData(dataSet, allData);
        const processedData = _.uniqWith(dataValues, _.isEqual);
        console.log(processedData);
        // return await utils.insertData({dataValues: processedData});
    } catch (e) {
        return e
    }
};

processQuarterly().then(response => {
    console.log(JSON.stringify(response));
});