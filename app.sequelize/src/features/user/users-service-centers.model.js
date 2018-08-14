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

const userDefinitions = require('./user.definitions');

module.exports = (sequelize, DataTypes) => {
    var UsersServiceCenters = sequelize.define(userDefinitions.USERS_SERVICE_CENTERS_TABLE_NAME, {
        serviceCenterId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
    }, { timestamps: false });
    return UsersServiceCenters;
};