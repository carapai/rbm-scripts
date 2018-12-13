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

    let data = [];

    if (fromDate && toDate) {
        periods = utils.enumerateDates(fromDate, toDate, 'Q', fmt)
    } else {
        const period = moment().subtract(1, 'Q').format(fmt);
        periods = [period]
    }

    try {
        const allLam08Data = periods.map(period => {
            return soap.getLAM08(period);
        });

        const allLam09Data = periods.map(period => {
            return soap.getLAM09(period);
        });

        const allLam10Data = periods.map(period => {
            return soap.getLAM10(period);

        });

        const allLam10DenominatorData = periods.map(period => {
            return soap.getLAM10Denominator(period);
        });


        const lam08Data = await Promise.all(allLam08Data);
        const lam09Data = await Promise.all(allLam09Data);
        const lam10Data = await Promise.all(allLam10Data);
        const lam10DataDenominator = await Promise.all(allLam10DenominatorData);

        lam08Data.forEach(d => {
            data = [...data, ...d];
        });

        lam09Data.forEach(d1 => {
            d1.forEach(d => {
                data = [...data, {...d, categoryOptioncombo: 'default'}];
            });
        });

        lam10Data.forEach(d => {
            data = [...data, ...d];
        });


        lam10DataDenominator.forEach(d1 => {
            d1.forEach(d => {
                data = [...data, {...d, categoryOptioncombo: 'default', code: 'LAM101'}];
            });
        });


        const dataValues = utils.processData(dataSet, data);
        const processedData = _.uniqWith(dataValues, _.isEqual);
        return await utils.insertData({dataValues: processedData});

    } catch (e) {
        return e;
    }


};

processQuarterly().then(response => {
    winston.log({level: 'info', message: JSON.stringify(response)});
});