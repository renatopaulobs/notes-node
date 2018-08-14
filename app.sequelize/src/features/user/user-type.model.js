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
 * @typedef UserType
 * @property {integer} id
 * @property {string} name.required
 */

const userTypeDefinitions = require('./user-type.definitions');

module.exports = (sequelize, DataTypes) => {
    var UserType = sequelize.define('UserType', {
        name: DataTypes.STRING(userTypeDefinitions.NAME_MAX_LENGTH)
    }, { timestamps: false });
    return UserType;
};