'use strict';

const winston = require('winston');
const { combine, format, printf, timestamp } = winston.format;
require('winston-daily-rotate-file');
const { v4: uuidv4 } = require('uuid');

class MyLogger {
    constructor() {
        const printLog = printf(
            ({ message, level, context, requestId, timestamp, metadata }) =>
                `[${timestamp}] ${level}: ${context} - ${requestId} - ${message} - ${JSON.stringify(metadata)}`
        );

        this.logger = winston.createLogger({
            format: combine(
                timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
                printLog
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.DailyRotateFile({
                    dirname: 'src/logs',
                    level: 'info',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '1m',
                    maxFiles: '14d',
                    format: combine(
                        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
                        printLog
                    )
                }),
                new winston.transports.DailyRotateFile({
                    dirname: 'src/logs',
                    level: 'error',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '1m',
                    maxFiles: '14d',
                    format: combine(
                        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
                        printLog
                    )
                })
            ]
        })
    }

    commonParams(params) {
        let context, req, metadata = {};
        if (!Array.isArray(params)) {
            context = params;
        } else {
            [context, req, metadata] = params;
        }
        const requestId = req.requestId;

        return {
            context, requestId, metadata
        }
    }

    log(message, params) {

        const logObject = Object.assign({
            message
        }, this.commonParams(params));

        this.logger.info(logObject);
    }

    error(message, params) {
        const logObject = Object.assign({
            message
        }, this.commonParams(params));

        this.logger.error(logObject);
    }
}

module.exports = new MyLogger();