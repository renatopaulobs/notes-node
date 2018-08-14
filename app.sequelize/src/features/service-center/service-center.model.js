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

/**
 * @typedef BaseServiceCenter
 * @property {integer} code.required
 * @property {string} name.required
 * @property {string} nickname.required
 * @property {string} address.required
 * @property {string} neighborhood.required
 * @property {string} zipCode.required
 * @property {string} juridicalPersonDocument
 * @property {string} phoneNumber
 * @property {string} email
 * @property {string} ownerName.required
 * @property {string} naturalPersonDocument
 * @property {string} geolocalizationCountryName.required
 * @property {string} geolocalizationCountryCode
 * @property {string} geolocalizationStateName
 * @property {string} geolocalizationStateCode
 * @property {string} geolocalizationCityName.required
 */

/**
 * @typedef {BaseServiceCenter} ServiceCenterBaseReturn
 * @property {integer} id
 * @property {string} ownerSignatureFileName
 * @property {boolean} isActive
 */

/**
 * @typedef {ServiceCenterBaseReturn} ServiceCenter
 * @property {ServiceCenterType.model} serviceCenterType
 * @property {Service.model} service
 */

/**
 * @typedef {ServiceCenterBaseReturn} ServiceCenterCreateReturn
 * @property {integer} serviceCenterTypeId
 */

/**
 * @typedef {BaseServiceCenter} ServiceCenterCreationDataBase
 * @property {integer} serviceCenterTypeId
 */

/**
 * @typedef ServiceCenterCreationData
 * @property {ServiceCenterCreationDataBase.model} serviceCenter
 * @property {string} ownerSignatureFile BASE64 encoded signature file in PNG format
 */

/**
 * @typedef {ServiceCenterCreationDataBase} ServiceCenterUpdateDataBase
 * @property {integer} id
 */

/**
 * @typedef ServiceCenterUpdateData
 * @property {string} ownerSignatureFile BASE64 encoded signature file in PNG format
 * @property {ServiceCenterUpdateDataBase.model} serviceCenter
 */

const userDefinitions = require('../user/user.definitions');

module.exports = (sequelize, DataTypes) => {
    var serviceCenter = sequelize.define('ServiceCenter', {
        code: DataTypes.INTEGER,
        name: DataTypes.STRING,
        nickname: DataTypes.STRING,
        address: DataTypes.STRING,
        neighborhood: DataTypes.STRING,
        zipCode: DataTypes.STRING,
        juridicalPersonDocument: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        email: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
        ownerName: DataTypes.STRING,
        naturalPersonDocument: DataTypes.STRING,
        ownerSignatureFileName: DataTypes.STRING,
        geolocalizationCountryName: DataTypes.STRING,
        geolocalizationCountryCode: DataTypes.STRING,
        geolocalizationStateName: DataTypes.STRING,
        geolocalizationStateCode: DataTypes.STRING,
        geolocalizationCityName: DataTypes.STRING
    }, { timestamps: false });
    serviceCenter.associate = (models) => {
        serviceCenter.belongsTo(models.ServiceCenterType, {
            foreignKey: 'serviceCenterTypeId'
        });
        serviceCenter.belongsToMany(models.Service, { through: 'ServiceCentersServices', timestamps: false, foreignKey: 'serviceCenterId' });
        serviceCenter.belongsToMany(models.User, { through: userDefinitions.USERS_SERVICE_CENTERS_TABLE_NAME, timestamps: false, foreignKey: 'serviceCenterId' });
    };
    return serviceCenter;
};
