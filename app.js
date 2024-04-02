const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const router = require('./src/routes');
const { v4: uuidv4 } = require('uuid');
const myLogger = require('./src/loggers/MyLogger.log');

require('dotenv').config();


const app = express();

//init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'] || uuidv4();
    req.requestId = requestId;
    myLogger.log(`Input params - ${req.method}`, [
        req.path,
        { requestId: req.requestId },
        req.method === 'POST' ? req.body : req.query
    ]);

    next();
});



//test redis pub/sub
// require('./src/tests/inventory.test');
// const productServiceTest = require('./src/tests/product.test');
// productServiceTest.purchaseProduct({ productId: 'product:001', quantity: 100 });

//init connect db
require('./src/dbs/init.mongodb');

const initRedis = require('./src/dbs/init.redis');
initRedis.initRedis();

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
    const message = error.message;

    const messageLog = `${statusCode} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`;
    myLogger.error(messageLog, [
        req.path,
        { requestId: req.requestId },
        { message }
    ])

    return res.status(statusCode).json({
        status: 'error',
        statusCode,
        // stack: error.stack,
        message
    })
})

module.exports = app;