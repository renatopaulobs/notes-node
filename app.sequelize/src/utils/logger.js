/*
 * Copyright (c) 2018 Samsung Electronics Co., Ltd. , (c) Center of Informatics
 * Federal University of Pernambuco.
 * All rights reserved.
 *
 * This software is a confidential and proprietary information of Samsung
 * Electronics, Inc. ("Confidential Information").  You shall not disclose such
 * Confidential Information and shall use it only in accordance with the terms
 * of the license agreement you entered into with Samsung Electronics.
 */

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
require('dotenv').config();
const constants = require('./constants');

const ERROR_LOG_PATH = `${constants.LOG_PATH}/${constants.LOG_ERROR_FILENAME}`;
const INFO_LOG_PATH = `${constants.LOG_PATH}/${constants.LOG_INFO_FILENAME}`;
const DEBUG_LOG_PATH = `${constants.LOG_PATH}/${constants.LOG_DEBUG_FILENAME}`;
const FULL_LOG_PATH = `${constants.LOG_PATH}/${constants.LOG_FULL_FILENAME}`;

const IS_LOG_INFO_ENABLED = process.env.LOG_INFO_ENABLED;
const IS_LOG_ERROR_ENABLED = process.env.LOG_ERROR_ENABLED;
const IS_LOG_DEBUG_ENABLED = process.env.LOG_DEBUG_ENABLED;


const tsFormat = () => (new Date().toISOString());

const logFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const errorLogger = createLogger({
    level: 'error',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.File({ filename: ERROR_LOG_PATH, level: 'error', timestamp: tsFormat }),
        new transports.File({ filename: FULL_LOG_PATH, level: 'error', timestamp: tsFormat })
    ]
});

const infoLogger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.File({ filename: INFO_LOG_PATH, level: 'info', timestamp: tsFormat }),
        new transports.File({ filename: FULL_LOG_PATH, level: 'info', timestamp: tsFormat })
    ]
});

const debugLogger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.File({ filename: DEBUG_LOG_PATH, level: 'debug', timestamp: tsFormat }),
        new transports.File({ filename: FULL_LOG_PATH, level: 'debug', timestamp: tsFormat })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    errorLogger.add(new transports.Console({
        format: combine(
            timestamp(),
            logFormat
        )
    }));
    infoLogger.add(new transports.Console({
        format: combine(
            timestamp(),
            logFormat
        )
    }));
    debugLogger.add(new transports.Console({
        format: combine(
            timestamp(),
            logFormat
        )
    }));
}

module.exports.info = function () {
    if (IS_LOG_INFO_ENABLED) {
        Array.from(arguments).forEach((message) => {
            infoLogger.info(message);
        });
    }
};

module.exports.error = function () {
    if (IS_LOG_ERROR_ENABLED) {
        Array.from(arguments).forEach((message) => {
            errorLogger.error(message);
        });
    }
};

module.exports.debug = function () {
    if (IS_LOG_DEBUG_ENABLED) {
        Array.from(arguments).forEach((message) => {
            debugLogger.debug(message);
        });
    }
};

module.exports.stream = {
    write: function (message) {
        infoLogger.info(message);
    }
};

