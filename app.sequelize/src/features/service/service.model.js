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
* @typedef Service
* @property {integer} id
* @property {string} name.required
* @property {string} logoFileName
* @property {string} url
* @property {string} uuId
* @property {boolean} isSCAdminAccess
*/
module.exports = (sequelize, DataTypes) => {
    var service = sequelize.define('Service', {
        name: DataTypes.STRING,
        logoFileName: DataTypes.STRING,
        url: DataTypes.STRING,
        uuId: DataTypes.UUID,
        isSCAdminAccess: DataTypes.BOOLEAN
    }, { timestamps: false });
    service.associate = (models) => {
        service.belongsToMany(models.ServiceCenter, { through: 'ServiceCentersServices', timestamps: false, foreignKey: 'serviceId' });
    };
    return service;
};
