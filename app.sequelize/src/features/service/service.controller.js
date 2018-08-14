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

const serviceBo = require('./service.bo.js');
const HttpStatus = require('http-status-codes');

const serviceController = {
    getAll(req, res) {
        return serviceBo
            .getAll(req.user)
            .then(services => res.status(HttpStatus.OK).send(services))
            .catch(error => res.status(HttpStatus.BAD_REQUEST).send(error));
    }
};

module.exports = serviceController;