const soap = require('./soap');
const utils = require('./utils');

const _ = require('lodash');


const dataSet = require('./lands-quarterly-mapping.json');


const processQuarterly = async () => {

    const data = await soap.getLAM08('2017Q1');
    const dataValues = utils.processData(dataSet, data['return']);

    return _.uniqWith(dataValues, _.isEqual);

   /* try {
        const response = await utils.insertData({dataValues});
        return response;
    } catch (e) {
       return e
    }*/

};

processQuarterly().then(response => {
    console.log(JSON.stringify(response));
});