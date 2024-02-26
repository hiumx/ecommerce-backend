
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

const removeUndefinedValue = obj => {
    Object.keys(obj).forEach(k => {
        if(!k || obj[k] === null || obj[k] === undefined)
            delete obj[k];
        else if(typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            removeUndefinedValue(obj[k]);
        }
    });
    return obj;
}

const objectNestedParser = obj => {
    const objParser = {};
    Object.keys(obj).forEach(k => {
        if(k && typeof obj[k] === 'object' ) {
            const res = objectNestedParser(obj[k]);
            Object.keys(obj[k]).forEach(a => {
                objParser[`${k}.${a}`] = res[a];
            })
        } else {
            objParser[k] = obj[k];
        }
    });

    return objParser;
}

module.exports = {
    getInfoData,
    getPubPriPairKey,
    getDataSelect,
    getDataUnSelect,
    removeUndefinedValue,
    objectNestedParser
}
