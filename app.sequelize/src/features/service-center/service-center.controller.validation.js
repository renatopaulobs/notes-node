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
const serviceCenterDefinitions = require('./service-center.definitions.js');
const constants = require('../../utils/constants');
const i18Nlabels = i18N.getLabels();

module.exports = {
    getSaveOrUpdateServiceCenter() {
        let labels = i18N.getLabels();
        let saveOrUpdateServiceCenterSchema =
            {
                serviceCenter:
                {
                    name: Joi.string().required().max(serviceCenterDefinitions.NAME_MAX_LENGTH).label(labels.serviceCenter.NAME),
                    code: Joi.number().integer().min(serviceCenterDefinitions.CODE_MIN_LENGTH).max(serviceCenterDefinitions.CODE_MAX_LENGTH).required().label(labels.serviceCenter.CODE),
                    serviceCenterTypeId: Joi.number().integer().required().label(labels.serviceCenter.TYPE_ID),
                    nickname: Joi.string().required().max(serviceCenterDefinitions.NICKNAME_MAX_LENGTH).label(labels.serviceCenter.NICKNAME),
                    address: Joi.string().required().max(serviceCenterDefinitions.ADDRESS_MAX_LENGTH).label(labels.serviceCenter.ADDRESS),
                    neighborhood: Joi.string().required().max(serviceCenterDefinitions.NEIGHBORHOOD_MAX_LENGTH).label(labels.serviceCenter.NEIGHBORHOOD),
                    geolocalizationCountryName: Joi.string().required().max(serviceCenterDefinitions.COUNTRY_MAX_LENGTH).label(labels.serviceCenter.COUNTRY),
                    geolocalizationStateName: Joi.string().required().max(serviceCenterDefinitions.STATE_MAX_LENGTH).label(labels.serviceCenter.STATE),
                    geolocalizationStateCode: Joi.string().required().label(labels.serviceCenter.STATE_CODE),
                    geolocalizationCityName: Joi.string().required().max(serviceCenterDefinitions.CITY_MAX_LENGTH).label(labels.serviceCenter.CITY),
                    email: Joi.string().email().allow(null).max(serviceCenterDefinitions.EMAIL_MAX_LENGTH).label(labels.serviceCenter.EMAIL),
                    phoneNumber: Joi.string().allow(null).max(serviceCenterDefinitions.PHONE_MAX_LENGTH).label(labels.serviceCenter.PHONE),
                    ownerName: Joi.string().required().max(serviceCenterDefinitions.OWNER_NAME_MAX_LENGTH).label(labels.serviceCenter.OWNER_NAME),
                    juridicalPersonDocument: Joi.string().max(serviceCenterDefinitions.JURIDICAL_PERSON_DOCUMENT_LENGTH).allow(null).regex(/^\d+$/),
                    zipCode: Joi.string().allow(null).max(serviceCenterDefinitions.ZIPCODE_MAX_LENGTH),
                    naturalPersonDocument: Joi.string().allow(null).max(serviceCenterDefinitions.NATURAL_PERSON_DOCUMENT_LENGTH)
                }
            };

        return saveOrUpdateServiceCenterSchema;
    },

    getId() {
        let idSchema =
            {
                id: Joi.number().integer().min(constants.MIN_INTEGER).required().label(i18Nlabels.common.ID)
            };

        return idSchema;
    },
    getUpdateStatusSchema() {
        let updateSchema =
            {
                isActive: Joi.boolean().required().label(i18Nlabels.common.STATUS)
            };
        return updateSchema;
    }
};

