const utils = require('./utils');

const dates = utils.enumerateDates('2013-01-01', '2018-12-31', 'Q', 'Y[Q]Q');

console.log(dates);