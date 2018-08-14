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
const databaseDefinitions = require('../config/database.definitions');
const serviceDefinitions = require('../../src/features/service/service.definitions');
module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.createTable(serviceDefinitions.SERVICES_TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                unique: true,
                type: databaseDefinitions.EXTENSION_CITEXT
            },
            logoFileName: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            url: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            uuId: {
                allowNull: false,
                type: Sequelize.UUID
            },
            isSCAdminAccess: {
                allowNull: false,
                type: Sequelize.BOOLEAN
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
        queryInterface.createTable(serviceDefinitions.SERVICES_HISTORY_TABLE_NAME, {
            id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            name: {
                type: databaseDefinitions.EXTENSION_CITEXT
            },
            logoFileName: {
                type: Sequelize.TEXT
            },
            url: {
                type: Sequelize.TEXT
            },
            isSCAdminAccess: {
                type: Sequelize.BOOLEAN
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable(serviceDefinitions.SERVICES_TABLE_NAME);
        queryInterface.dropTable(serviceDefinitions.SERVICES_HISTORY_TABLE_NAME);
    }
};