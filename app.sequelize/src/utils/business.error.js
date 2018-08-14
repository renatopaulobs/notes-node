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
const HttpStatus = require('http-status-codes');

module.exports = class BusinessError extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.IsBusinessError = true;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.status = status || HttpStatus.INTERNAL_SERVER_ERROR;
    }
};

