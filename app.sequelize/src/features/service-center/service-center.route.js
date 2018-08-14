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

const SERVICE_CENTER_URL = '/v1/servicecenter';
const Router = require('express').Router;
const serviceCenterRouter = Router();
const serviceCenterController = require('./service-center.controller.js');
const coreController = require('../core/core.controller');
const permit = require('../../start.server/permission.middleware');
const constants = require('../../utils/constants');

/**
 * Add a new Service Center
 * @route POST /v1/servicecenter - Add a new Service Center
 * @group Service Center
 * @param {ServiceCenterCreationData.model}  ServiceCenterCreationData.body.required - Service Center object that needs to be added
 * @returns {ServiceCenterCreateReturn.model} 201- Successful operation
 * @returns 400- Invalid input
 * @returns 401- Unauthorized
 */
serviceCenterRouter.post(coreController.PATH_ROOT, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID), serviceCenterController.create);

/**
 * Returns a list of Service Centers types
 * @route GET /v1/servicecenter/type Get All Service Centers Types
 * @group Service Center
 * @returns {ServiceCenterType.model} 200- Successful operation
 * @returns 401- Unauthorized
 */
serviceCenterRouter.get(coreController.PATH_ROOT_TYPE, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID), serviceCenterController.getAllServiceCenterTypes);

/**
 * Returns a single Service Center
 * @route GET /v1/servicecenter/{serviceCenterId} Find Service Center by ID
 * @group Service Center
 * @param {integer} serviceCenterId.path.required - ID of Service Center to return
 * @returns {ServiceCenter.model}  200- Successful operation
 * @returns 400- Invalid ID supplied
 * @returns 404- Service Center not found
 * @returns 401- Unauthorized
 */
serviceCenterRouter.get(coreController.PATH_ROOT_ID, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID, constants.USER_TYPE_ID), serviceCenterController.getById);

/**
 * Get All Service Centers
 * @route GET /v1/servicecenter Get All Service Centers
 * @group Service Center
 * @param {string} _limit.query Size of the page for pagination
 * @param {integer} _page.query Page for pagination
 * @param {string} nickname.query Name of Service Center
 * @param {string} location.query Location of Service Center
 * @param {integer} type.query Type of Service Center
 * @param {boolean} isActive.query Status of Service Center
 * @returns {ServiceCenter.model} 200- Successful operation
 * @returns 401- Unauthorized
 */
serviceCenterRouter.get(coreController.PATH_ROOT, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID), serviceCenterController.getAll);

/**
 * Update an existing Service Center
 * @route PUT /v1/servicecenter/{serviceCenterId} Update an existing Service Center
 * @group Service Center
 * @param {integer} serviceCenterId.path.required - ID of Service Center to be updated
 * @param {ServiceCenterUpdateData.model}  serviceCenter.body.required - Service Center object that needs to be updated. If the parameter goes null or undefined, it won't be updated
 * @returns {ServiceCenterCreateReturn.model} 200- Successful operation
 * @returns 400- Invalid input
 * @returns 404- Service Center not found
 * @returns 401- Unauthorized
 */
serviceCenterRouter.put(coreController.PATH_ROOT_ID, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID), serviceCenterController.update);

/**
* Associate services to an existing Service Center
* @route POST /v1/servicecenter/associate Associate services to an existing Service Center
* @group Service Center
* @param {ServiceCenterAssociationsUpdateData.model} serviceCenterAssociationsUpdateData.body.required New association data
* @returns {ServiceCenterService.model} 200- Successful operation
* @returns 400- Invalid input
* @returns 404- Service Center not found
* @returns 401- Unauthorized
*/
serviceCenterRouter.post(coreController.PATH_ROOT_ASSOCIATE, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID), serviceCenterController.associateServices);

/**
 * Change user status
 * @route PUT /v1/servicecenter/{serviceCenterId}/status Update an existing Service Center status
 * @group Service Center
 * @param {integer} serviceCenterId.path.required - ID of Service Center to be updated
 * @param {IsActive.model}  isActive.body.required - Status to be updated. If the file goes null or undefined, it won't be updated
 * @returns 200- Successful operation
 * @returns 400- Invalid input
 * @returns 404- Service Center not found
 * @returns 401- Unauthorized
 */
serviceCenterRouter.put(coreController.PATH_ROOT_STATUS, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID), serviceCenterController.updateStatus);

/**
 * Deletes a Service Center
 * @route DELETE /v1/servicecenter/{serviceCenterId}/ - Deletes a Service Center
 * @group Service Center
 * @param {integer} serviceCenterId.path.required - ID of Service Center to be deleted
 * @returns 204- Successful operation
 * @returns 400- Invalid input
 * @returns 404- Service Center not found
 * @returns 401- Unauthorized
 */

/**
 * Get Service Center CSV Report
 * @route GET /v1/servicecenter/report/ - Get Service Center CSV Report
 * @group Service Center
 * @returns 200- Successful operation (CSV File)
 * @returns 404- Service Center not found
 * @returns 401- Unauthorized
 */

module.exports = (app) => {
    app.use(SERVICE_CENTER_URL, serviceCenterRouter);
};
