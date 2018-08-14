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

const serviceCenterBo = require('./service-center.bo');
const HttpStatus = require('http-status-codes');
const coreController = require('../core/core.controller');
const serviceCenterControllerValidation = require('./service-center.controller.validation');
const constants = require('../../utils/constants');
const utils = require('../../utils/util');
const businessError = require('../../utils/business.error');
const I18NHelper = require('../../utils/locale/I18N.helper');

const serviceCenterController = {
    create(req, res, next) {
        const requestServiceCenter = req.body.serviceCenter;
        const signatureImage = req.body.ownerSignatureFile;
        coreController.bodyValidation(req, res, next, serviceCenterControllerValidation.getSaveOrUpdateServiceCenter(), () => {
            serviceCenterBo
                .save(requestServiceCenter, 0, signatureImage) // passing 0 as id to indicate create.
                .then(serviceCenter => res.status(HttpStatus.CREATED).send(serviceCenter))
                .catch(error => next(error));
        });
    },
    update(req, res, next) {
        const serviceCenterId = parseInt(req.params.id, constants.RADIX);
        const requestServiceCenter = req.body.serviceCenter;
        const signatureImage = req.body.ownerSignatureFile;
        coreController.queryParamsValidation(req, res, next, serviceCenterControllerValidation.getId(), () => {
            coreController.bodyValidation(req, res, next, serviceCenterControllerValidation.getSaveOrUpdateServiceCenter(), () => {
                if (utils.isValidValueInteger(serviceCenterId)) {
                    serviceCenterBo
                        .save(requestServiceCenter, serviceCenterId, signatureImage, req.user)
                        .then(serviceCenter => res.status(HttpStatus.OK).send(serviceCenter))
                        .catch(error => next(error));
                } else {
                    next(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_INVALID_SERVICE_CENTER_ID, HttpStatus.BAD_REQUEST));
                }
            });
        });
    },
    updateStatus(req, res, next) {
        const serviceCenterId = parseInt(req.params.id, constants.RADIX);
        const status = req.body.isActive;
        coreController.queryParamsValidation(req, res, next, serviceCenterControllerValidation.getId(),
            () => {
                coreController.bodyValidation(req, res, next, serviceCenterControllerValidation.getUpdateStatusSchema(), () => {
                    if (utils.isValidValueInteger(serviceCenterId)) {
                        serviceCenterBo.updateStatus(serviceCenterId, status)
                            .then(() => res.status(HttpStatus.OK).send())
                            .catch((err) => next(err));
                    } else {
                        next(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_INVALID_SERVICE_CENTER_ID, HttpStatus.BAD_REQUEST));
                    }
                });
            });
    },
    getById(req, res, next) {
        const serviceCenterId = parseInt(req.params.id, constants.RADIX);
        coreController.queryParamsValidation(req, res, next, serviceCenterControllerValidation.getId(), () => {
            if (utils.isValidValueInteger(serviceCenterId)) {
                return serviceCenterBo
                    .getById(serviceCenterId)
                    .then(serviceCenter => res.status(HttpStatus.OK).send(serviceCenter))
                    .catch(error => next(error));
            } else {
                next(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_INVALID_SERVICE_CENTER_ID, HttpStatus.BAD_REQUEST));
            }
        });
    },
    getAll(req, res, next) {
        return serviceCenterBo
            .getAll(req.query, req.user)
            .then(serviceCenters => res.header(constants.X_TOTAL_COUNT, serviceCenters.count).status(HttpStatus.OK).send(serviceCenters.rows))
            .catch(error => next(error));
    },
    associateServices(req, res, next) {
        const requestServiceCenter = req.body;
        return serviceCenterBo
            .associateServices(requestServiceCenter)
            .then(serviceCenters => res.status(HttpStatus.OK).send(serviceCenters))
            .catch(error => next(error));
    },
    getAllServiceCenterTypes(req, res, next) {
        return serviceCenterBo
            .getAllServiceCenterTypes()
            .then(serviceCenterTypes => res.status(HttpStatus.OK).send(serviceCenterTypes))
            .catch(error => next(error));
    }
};

module.exports = serviceCenterController;

