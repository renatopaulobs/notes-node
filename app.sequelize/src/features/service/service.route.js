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

const PRODUCT_URL = '/v1/service';
const serviceController = require('./service.controller.js');
const serviceRouter = require('express').Router();
const permit = require('../../start.server/permission.middleware');
const constants = require('../../utils/constants');

/**
 * Returns a list of Services
 * @route GET /v1/service Get All Services
 * @group Service
 * @returns {Service.model} 200- Successful operation
 * @returns 401- Unauthorized
 */
serviceRouter.get('/', permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID), serviceController.getAll);

module.exports = (app) => {
    app.use(PRODUCT_URL, serviceRouter);
};