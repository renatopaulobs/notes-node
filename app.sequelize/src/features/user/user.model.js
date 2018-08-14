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
 * @typedef BaseUser
 * @property {string} login.required
 * @property {string} name.required
 * @property {boolean} isActive
 * @property {string} email.required
 */

/**
 * @typedef UserHasServiceAssociationnResponse
 * @property {boolean} hasServicePermission
 */

/**
 * @typedef {BaseUser} User
 * @property {ServiceCenter.model} serviceCenter.required
 * @property {UserType.model} userType.required
 */

/**
 * @typedef UpdateUser
 * @property {string} name.required
 * @property {string} email
 */

/**
 * @typedef UserSaveData
 * @property {string} login.required
 * @property {string} name.required
 * @property {string} email.required
 * @property {Array.<integer>} serviceCenterIds
 * @property {integer} userTypeId.required
 */

/**
 * @typedef {BaseUser} UserWithoutServiceCenter
 * @property {UserType.model} userType.required
 */

/**
 * @typedef UserGroupedByServiceCenter
 * @property {ServiceCenter.model} serviceCenter.required
 * @property {Array.<UserWithoutServiceCenter>} users.required
 */

const userDefinitions = require('./user.definitions');

module.exports = (sequelize, DataTypes) => {
    var user = sequelize.define('User', {
        name: DataTypes.STRING,
        login: DataTypes.STRING,
        email: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
        countryCode: DataTypes.STRING
    }, { timestamps: false });
    user.associate = function (models) {
        user.belongsTo(models.UserType, {
            foreignKey: 'userTypeId'
        });
        user.belongsToMany(models.ServiceCenter, { through: userDefinitions.USERS_SERVICE_CENTERS_TABLE_NAME, timestamps: false, foreignKey: 'userId' });
    };
    return user;
};