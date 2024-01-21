const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

//init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

//init connect db

//init routes
app.get('/', (req, res, next) => {
    const message = 'Welcome to express js';
    res.status(200).json({
        message: 'OK',
        data: message.repeat(10000)
    })
})

//init handle error

module.exports = app;