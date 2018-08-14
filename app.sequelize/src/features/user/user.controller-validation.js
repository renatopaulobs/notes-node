/*
* Copyright (c) 2018 Samsung Electronics Co., Ltd. , (c) Center of Informatics
* Federal University of Pernambuco.
* All rights reserved.
*
* This software is a confidential and proprietary information of Samsung
* Electronics, Inc. ("Confidential Information"). You shall not disclose such
* Confidential Information and shall use it only in accordance with the terms
* of the license agreement you entered into with Samsung Electronics.
*/

const Joi = require('joi');
const i18N = require('../../utils/locale/I18N.helper');
const userDefinitions = require('./user.definitions');
const constants = require('../../utils/constants');
const labels = i18N.getLabels();


module.exports = {
    getSaveUserSchema() {
        const joiCustomMessages = i18N.getJoiCustomMessages();
        let saveUserSchema =
            {
                name: Joi.string().required().max(userDefinitions.NAME_MAX_LENGTH).label(labels.user.NAME),
                login: Joi.string().regex(constants.WITHOUT_WHITESPACE_REGEX, { name: joiCustomMessages.ERROR_WITHOUT_WHITESPACE_REGEX }).required().min(userDefinitions.LOGIN_MIN_LENGTH).max(userDefinitions.LOGIN_MAX_LENGTH).label(labels.user.LOGIN),
                email: Joi.string().required().regex(constants.EMAIL_REGEX_EXPRESSION, { name: joiCustomMessages.ERROR_INVALID_FORMAT_EMAIL_REGEX }).max(constants.EMAIL_MAX_LENGTH).label(labels.user.EMAIL),
                serviceCenterIds: Joi.array().items(Joi.number().integer()).label(labels.user.SERVICE_CENTER_IDS),
                userTypeId: Joi.number().integer().required().label(labels.user.USER_TYPE_ID)
            };

        return saveUserSchema;
    },
    getAllUserSchema(){
        let getAllUserSchema = {
            userType: Joi.array().items(Joi.number().integer()).label(labels.user.USER_TYPE_ID)
        };
        return getAllUserSchema;
    },
    getUsersByScIdSchema() {
        let serviceCenterIdSchema =
            {
                serviceCenterId: Joi.number().integer().min(constants.MIN_INTEGER).required().label(labels.user.SC_ID)
            };
        return serviceCenterIdSchema;
    },
    getUpdateUserSchema() {
        const joiCustomMessages = i18N.getJoiCustomMessages();
        let updateUserSchema =
            {
                name: Joi.string().required().max(userDefinitions.NAME_MAX_LENGTH).label(labels.user.NAME),
                email: Joi.string().required().regex(constants.EMAIL_REGEX_EXPRESSION, { name: joiCustomMessages.ERROR_INVALID_FORMAT_EMAIL_REGEX }).max(constants.EMAIL_MAX_LENGTH).label(labels.user.EMAIL)
            };
        return updateUserSchema;
    },
    getUpdateUserSchemaPathParam() {
        const joiCustomMessages = i18N.getJoiCustomMessages();
        let updateUserSchemaPathParam =
            {
                login: Joi.string().regex(constants.WITHOUT_WHITESPACE_REGEX, { name: joiCustomMessages.ERROR_WITHOUT_WHITESPACE_REGEX })
                    .min(userDefinitions.LOGIN_MIN_LENGTH).max(userDefinitions.LOGIN_MAX_LENGTH).label(labels.user.LOGIN).label(labels.user.LOGIN)
            };
        return updateUserSchemaPathParam;
    },
    getUpdateStatusUserSchemaPathParam() {
        const joiCustomMessages = i18N.getJoiCustomMessages();
        let updateUserSchemaPathParam =
            {
                login: Joi.string().regex(constants.WITHOUT_WHITESPACE_REGEX, { name: joiCustomMessages.ERROR_WITHOUT_WHITESPACE_REGEX })
                    .min(userDefinitions.LOGIN_MIN_LENGTH).max(userDefinitions.LOGIN_MAX_LENGTH).label(labels.user.LOGIN)
            };
        return updateUserSchemaPathParam;
    },
    getUpdateStatusUserSchema() {
        let updateUserSchema =
            {
                isActive: Joi.boolean().required().label(labels.common.STATUS)
            };
        return updateUserSchema;
    },
    getUsersByLoginSchema() {
        const joiCustomMessages = i18N.getJoiCustomMessages();
        let userLoginSchema =
            {
                login: Joi.string().regex(constants.WITHOUT_WHITESPACE_REGEX, { name: joiCustomMessages.ERROR_WITHOUT_WHITESPACE_REGEX }).required()
                    .min(userDefinitions.LOGIN_MIN_LENGTH).max(userDefinitions.LOGIN_MAX_LENGTH).label(labels.user.LOGIN)
            };
        return userLoginSchema;
    },
    hasServicePermissionSchema() {
        let hasServicePermission =
            {
                serviceUuId: Joi.string().regex(constants.UUID_REGEX).required().label(labels.user.SERVICE_UUID)
            };
        return hasServicePermission;
    }
};