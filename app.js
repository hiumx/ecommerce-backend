const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const router = require('./src/routes');

require('dotenv').config();


const app = express();

//init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

//init connect db
require('./src/dbs/init.mongodb');

//init routes
router(app);

//init handle error

module.exports = app;