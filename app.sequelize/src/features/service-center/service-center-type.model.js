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
 * @typedef ServiceCenterType
 * @property {integer} id
 * @property {string} name.required
 */
module.exports = (sequelize, DataTypes) => {
    var serviceCenterType = sequelize.define('ServiceCenterType', {
        name: DataTypes.STRING
    }, { timestamps: false });

    return serviceCenterType;
};
