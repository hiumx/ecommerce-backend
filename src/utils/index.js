
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

// ['a', 'b'] => {a: 1, b: 1}
const getDataSelect = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]));
}

const getDataUnSelect = (unSelect = []) => {
    return Object.fromEntries(unSelect.map(el => [el, 0]));
}

module.exports = {
    getInfoData,
    getPubPriPairKey,
    getDataSelect,
    getDataUnSelect
}