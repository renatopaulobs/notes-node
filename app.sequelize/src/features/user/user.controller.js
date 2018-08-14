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

const authService = require('./auth/auth.service');
const userBo = require('./user.bo');
const HttpStatus = require('http-status-codes');
const coreController = require('../core/core.controller');
const userControllerValidation = require('./user.controller-validation');
const constants = require('../../utils/constants');
const utf8 = require('utf8');
const utils = require('../../utils/util');
const businessError = require('../../utils/business.error');
const I18NHelper = require('../../utils/locale/I18N.helper');

const userController = {
    getAll(req, res, next) {
        coreController.queryValidation(req, res, next, userControllerValidation.getAllUserSchema(), () => {
            const queryParams = req.query;
            return userBo
                .getAll(queryParams, req.user)
                .then(users => res.header(constants.X_TOTAL_COUNT, users.count).status(HttpStatus.OK).send(users.rows))
                .catch(error => next(error));
        });
    },
    createUser(req, res, next) {
        const user = req.body;
        coreController.bodyValidation(req, res, next, userControllerValidation.getSaveUserSchema(), () => {
            if (utils.isValidValueInteger(user.userTypeId)) {
                userBo
                    .createUser(user, req.user)
                    .then(() => res.status(HttpStatus.CREATED).send())
                    .catch(error => next(error));
            } else {
                next(new businessError(I18NHelper.getBusinessErrorMessages().USER_TYPE_INVALID, HttpStatus.BAD_REQUEST));
            }
        });
    },
    updateUser(req, res, next) {
        coreController.queryParamsValidation(req, res, next, userControllerValidation.getUpdateUserSchemaPathParam(),
            () => {
                coreController.bodyValidation(req, res, next, userControllerValidation.getUpdateUserSchema(), () => {
                    const user = req.body;
                    const username = utf8.decode(req.params.login);
                    return userBo
                        .updateUser(username, user, req.user)
                        .then(user => res.status(HttpStatus.OK).send())
                        .catch(error => next(error));
                });
            });
    },
    getByLogin(req, res, next) {
        coreController.queryParamsValidation(req, res, next, userControllerValidation.getUsersByLoginSchema(), () => {
            const login = req.params.login;
            return userBo
                .getByLogin(login, req.user)
                .then(user => res.status(HttpStatus.OK).send(user))
                .catch(error => next(error));
        });
    },
    deleteUser(req, res, next) {
        const userId = req.params.id;
        return userBo
            .deleteUser(userId)
            .then(user => res.status(HttpStatus.OK).send(user))
            .catch(error => next(error));
    },
    findUsersByServiceCenterId(req, res, next) {
        coreController.queryParamsValidation(req, res, next, userControllerValidation.getUsersByScIdSchema(), () => {
            const serviceCenterId = parseInt(req.params.serviceCenterId, constants.RADIX);
            if (utils.isValidValueInteger(serviceCenterId)) {
                return userBo
                    .findUsersByServiceCenterId(serviceCenterId)
                    .then(users => res.status(HttpStatus.OK).send(users))
                    .catch(error => next(error));
            } else {
                next(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_INVALID_SERVICE_CENTER_ID, HttpStatus.BAD_REQUEST));
            }
        });
    },
    changeUserStatus(req, res, next) {
        coreController.queryParamsValidation(req, res, next, userControllerValidation.getUpdateStatusUserSchemaPathParam(),
            () => {
                coreController.bodyValidation(req, res, next, userControllerValidation.getUpdateStatusUserSchema(), () => {
                    const login = utf8.decode(req.params.login);
                    const isActive = req.body.isActive;
                    return userBo
                        .changeUserStatus(login, isActive, req.user)
                        .then(() => res.status(HttpStatus.OK).send())
                        .catch(error => next(error));
                });
            });
    },
    getUserReport(req, res, next) {
        return userBo
            .getUserReport()
            .then(user => res.status(HttpStatus.OK).send(user))
            .catch(error => next(error));
    },
    getAllUserTypes(req, res, next) {
        return userBo
            .getAllUserTypes()
            .then(userTypes => res.status(HttpStatus.OK).send(userTypes))
            .catch(error => next(error));
    },
    getUserTypeById(req, res, next) {
        const userTypeId = req.params.id;
        return userBo
            .getUserTypeById(userTypeId)
            .then(userType => res.status(HttpStatus.OK).send(userType))
            .catch(error => next(error));
    },
    hasServicePermission(req, res, next) {
        coreController.queryParamsValidation(req, res, next, userControllerValidation.hasServicePermissionSchema(), () => {
            authService.getUser(req.cookies).then((user) => {
                const serviceUuid = req.params.serviceUuId;
                return userBo
                    .hasServicePermission(user.data.Username, serviceUuid)
                    .then(hasPermission => res.status(HttpStatus.OK).send(hasPermission))
                    .catch(error => next(error));
            }).catch(err => res.status(HttpStatus.FORBIDDEN).send());
        });
    }
};
module.exports = userController;