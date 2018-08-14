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

const USER_URL = '/v1/user';
const PATH_ROOT_SERVICE_CENTER_ID = '/servicecenter/:serviceCenterId';
const PATH_ROOT_USER_LOGIN_STATUS = '/:login/status';
const PATH_ROOT_USER_SERVICE_PERMISSION = '/hasServicePermission/:serviceUuId';
const PATH_ROOT_USER_LOGIN = '/:login';
const PATH_OPEN_ACCESS_CREATE = '/openAccessCreate';

const Router = require('express').Router;
const userControllerRouter = Router();
const userController = require('./user.controller');
const coreController = require('../core/core.controller');
const permit = require('../../start.server/permission.middleware');
const constants = require('../../utils/constants');

/**
 * Get All Users
 * @route GET /v1/user Get All Users
 * @group User
 * @param {string} name.query Name of User
 * @param {string} serviceCenterNickname.query Nickname of User's Service Center
 * @param {Array.<integer>} userType.query Types of User
 * @param {integer} _page.query Specify the page number in result
 * @param {integer} _limit.query It specifies the quantity of elements in result
 * @returns {User.model} 200- Successful operation
 * @returns 401- Unauthorized
 */
userControllerRouter.get(coreController.PATH_ROOT, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID), userController.getAll);

/**
 * Add a new User
 * @route POST /v1/user/ - Add a new User
 * @group User
 * @param {UserSaveData.model}  user.body.required - User object that needs to be added
 * @returns 201- Successful operation
 * @returns 400- Invalid input
 * @returns 401- Unauthorized
 */
userControllerRouter.post(coreController.PATH_ROOT, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID), userController.createUser);

/**
 * Update an existing User
 * @route PUT /v1/user/{login} - Update an existing User
 * @group User
 * @param {string} login.path.required - login of User to return
 * @param {UpdateUser.model}  user.body.required - User object that needs to be updated
 * @returns 200- Successful operation
 * @returns 400- Invalid input
 * @returns 404- User not found
 * @returns 401- Unauthorized
 */
userControllerRouter.put(PATH_ROOT_USER_LOGIN, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID, constants.USER_TYPE_ID), userController.updateUser);

/**
 * Find User by Login
 * @route GET /v1/user/{login} - Find User by Login
 * @group User
 * @param {string} login.path.required - login of User to return
 * @returns {User.model} 200- Successful operation
 * @returns 400- Invalid input
 * @returns 404- User not found
 * @returns 401- Unauthorized
 */
userControllerRouter.get(PATH_ROOT_USER_LOGIN, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID, constants.USER_TYPE_ID), userController.getByLogin);

/**
 * Deletes an User
 * @route DELETE /v1/user/{login} - Deletes an User
 * @group User
 * @param {string} login.path.required Login of User to be deleted
 * @returns 204- Successful operation
 * @returns 400- Invalid input
 * @returns 404- User not found
 * @returns 401- Unauthorized
 */
userControllerRouter.delete(coreController.PATH_ROOT_ID, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID), userController.deleteUser);

/**
 * Change status of an existing User
 * @route PUT /v1/user/{login}/status - Change status of an existing User
 * @group User
 * @param {IsActive.model} isActive.body.required User status that needs to be updated
 * @param {string} login.path.required Login of User to change status
 * @returns 200- Successful operation
 * @returns 400- Invalid input
 * @returns 404- User not found
 * @returns 401- Unauthorized
 */
userControllerRouter.put(PATH_ROOT_USER_LOGIN_STATUS, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID), userController.changeUserStatus);

/**
 * Get User CSV Report
 * @route GET /v1/user/report/ Get User CSV Report
 * @group User
 * @returns 200- Successful operation (CSV file)
 * @returns 404- User not found
 * @returns 401- Unauthorized
 */
userControllerRouter.get(coreController.PATH_REPORT, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID), userController.getUserReport);

/**
 * Find Users by Service Center Id
 * @route GET /v1/user/servicecenter/{serviceCenterId} - Find Users by Service Center Id
 * @group User
 * @param {integer} serviceCenterId.path.required ID of Service Center of User to return
 * @returns {UserGroupedByServiceCenter.model} 200- Successful operation
 * @returns 400- Invalid input
 * @returns 404- User not found
 * @returns 401- Unauthorized
 */
userControllerRouter.get(PATH_ROOT_SERVICE_CENTER_ID, permit(constants.MASTER_ADMIN_TYPE_ID, constants.SAMSUNG_ADMIN_TYPE_ID, constants.SERVICE_CENTER_ADMIN_TYPE_ID), userController.findUsersByServiceCenterId);

userControllerRouter.post(PATH_OPEN_ACCESS_CREATE, userController.createUser);

/**
 * User has Service Permission by User Id and Service UUID
 * @route GET /v1/user/hasservicepermission/{serviceUuId} - Check if User has Permission to access Service
 * @group User
 * @param {string} serviceUuId.path.required UUID of Service accessed
 * @returns {UserHasServiceAssociationnResponse.model} 200- Successful operation
 * @returns 400- Invalid input
 * @returns 404- User not found
 * @returns 401- Unauthorized
 */
userControllerRouter.get(PATH_ROOT_USER_SERVICE_PERMISSION, userController.hasServicePermission);

module.exports = (app) => {
    app.use(USER_URL, userControllerRouter);
};