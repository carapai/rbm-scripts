const soap = require('soap');
const url = 'http://10.10.69.141:4740/LAISWebServiceP/RBME?WSDL';

module.exports.getLAM08 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            console.log(JSON.stringify(client));
            client.getlistOfLAM08(args, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    });
};

module.exports.getLAM07 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            //Todo call method from soap
            resolve([]);
        });
    });
};


module.exports.getLAM09 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            //Todo call method from soap
            resolve([]);
        });
    });
};


module.exports.getLAM10 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            //Todo call method from soap
            resolve([]);
        });
    });
};


module.exports.getLAM24 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            //Todo call method from soap
            resolve([]);
        });
    });
};

module.exports.getLAM25 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            //Todo call method from soap
            resolve([]);
        });
    });
};

module.exports.getLAM12 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            //Todo call method from soap
            resolve([]);
        });
    });
};