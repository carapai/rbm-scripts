const soap = require('soap');
const url = 'http://10.10.69.141:4740/LAISWebServiceP/RBME?WSDL';

module.exports.getLAM08 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            client.getlistOfLAM08(args, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    });
};