'use strict'

const mongoose = require('mongoose');

const stringConnection = 'mongodb://localhost:27017/shopDEV';

mongoose.connect(stringConnection)
    .then(() => {
        console.log('Connect db successfully.');
    })
    .catch(err => console.log('Connect error!'));


module.exports = mongoose;