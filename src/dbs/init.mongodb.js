'use strict'

const mongoose = require('mongoose');
const { countConnect, checkOverload } = require('../helpers/check.connect');
const { db: { name, host, port } } = require('../configs/config.mongodb');

const stringConnection = `mongodb://${host}:${port}/${name}`;

class DataBase {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {

        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(stringConnection, {
            // maximum number connect to db
            // if have 51 connect then the last connect will 
            // await one of 50 connected done to can be connect 
            maxPoolSize: 50
        })
            .then(() => {
                countConnect();
                checkOverload();
                console.log('Connect db PRO successfully.');
            })
            .catch(err => console.log('Connect error!'));
    }

    static getInstance() {
        if (!DataBase.instance) {
            DataBase.instance = new DataBase();
        }
        return DataBase.instance;
    }
}

const instanceMongodb = DataBase.getInstance();


module.exports = instanceMongodb;