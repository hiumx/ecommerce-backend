
const _ = require('lodash');
const crypto = require('node:crypto');

const getInfoData = ({ fields, object }) => {
    return _.pick(object, fields);
}

const getPubPriPairKey = () => {
    const publicKey = crypto.randomBytes(64).toString('hex');
    const privateKey = crypto.randomBytes(64).toString('hex');
    return {
        publicKey, privateKey
    }
}

module.exports = {
    getInfoData,
    getPubPriPairKey
}