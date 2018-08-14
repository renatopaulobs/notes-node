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
require('dotenv').config();
const constants =
{
    TYPE_LOG_DEV: 'dev',
    DEFAULT_DEGUB_TYPE: 'prod',
    ENABLE_SWAGGER: process.env.ENABLE_SWAGGER === 'true',
    ENABLE_FORCE_HTTPS: process.env.ENABLE_FORCE_HTTPS === 'true',
    HOST: '0.0.0.0',
    PERCENT: '%',
    EMPTY_STRING: '',
    X_TOTAL_COUNT: 'X-Total-Count',
    BODY: 'body',
    ERROR_TYPE_PARSE: 'entity.parse.failed',
    SEQUELIZE_UNIQUE_CONSTRAINT_ERROR: 'SequelizeUniqueConstraintError',
    UNDEFINED: 'undefined',
    PRODUCTION: 'production',

    AT: '@',
    DOT: '.',

    EMAIL_MAX_LENGTH: 256,
    MAX_LENGTH_EMAIL_PIECE: 64,
    MIN_INTEGER: 1,
    MAX_INTEGER: 2147483647,
    RADIX: 10,

    WITHOUT_WHITESPACE_REGEX: /^\S*$/,
    EMAIL_REGEX_EXPRESSION: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gmi,
    UUID_REGEX: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    MASTER_ADMIN_TYPE_ID: 1,
    SAMSUNG_ADMIN_TYPE_ID: 2,
    SERVICE_CENTER_ADMIN_TYPE_ID: 3,
    USER_TYPE_ID: 4,

    LOG_PATH: process.env.LOG_PATH || './log',
    LOG_ERROR_FILENAME: process.env.LOG_ERROR_FILENAME || 'error.log',
    LOG_INFO_FILENAME: process.env.LOG_INFO_FILENAME || 'info.log',
    LOG_DEBUG_FILENAME: process.env.LOG_DEBUG_FILENAME || 'debug.log',
    LOG_FULL_FILENAME: process.env.LOG_FULL_FILENAME || 'full.log'
};

module.exports = constants;
