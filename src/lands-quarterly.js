const soap = require('./soap');
const utils = require('./utils');


const dataSet = require('./lands-quarterly-mapping.json');


const processQuarterly = async () => {

    const data = await soap.getLAM08('2017Q1');
    const dataValues = utils.processData(dataSet, data['return']);

    return dataValues;

};

processQuarterly().then(response => {
    console.log(JSON.stringify(response, null, 2));
});