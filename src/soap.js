const soap = require('soap');
const url = 'http://10.10.69.141:4740/LAISWebService/RBME?wsdl';

module.exports.getLAM08 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            console.log(err)
            if (err) reject(err);
            client.getlistOfLAM08(args, (err, result) => {
                console.log(err);
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
            resolve({return: []});
        });
    });
};


module.exports.getLAM09 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            client.getValueOfLAM09(args, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    });
};


module.exports.getLAM10 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            client.getlistOfLAM10(args, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    });
};


module.exports.getLAM24 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            //Todo call method from soap
            resolve({return: []});
        });
    });
};

module.exports.getLAM25 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            //Todo call method from soap
            resolve({return: []});
        });
    });
};

module.exports.getLAM12 = period => {
    const args = {period: period};
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) reject(err);
            client.getValueOfLAM12(args, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    });
};