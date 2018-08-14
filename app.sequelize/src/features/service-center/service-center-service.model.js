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
 * @typedef ServiceCenterService
 * @property {integer} serviceCenterId.required
 * @property {integer} serviceId.required
 */

/**
 * @typedef ServiceCenterAssociationsUpdateData
 * @property {integer} id.required - ID of Service Center to be updated
 * @property {integer[]} addAsssociation - IDs of Services to be added
 * @property {integer[]} deleteAssociation - IDs of Services to be deleted
 */
module.exports = (sequelize, DataTypes) => {
    var serviceCenterService = sequelize.define('ServiceCentersServices', {
        serviceCenterId: DataTypes.INTEGER,
        serviceId: DataTypes.INTEGER
    }, { timestamps: false });

    return serviceCenterService;
};
