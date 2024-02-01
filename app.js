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

//handle error

app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.statusCode = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error!';
    return res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    })
})

module.exports = app;