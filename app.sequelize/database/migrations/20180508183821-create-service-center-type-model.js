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
const serviceCenterTypeDefinitions = require('../../src/features/service-center/service-center-type.definitions');
module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.createTable(serviceCenterTypeDefinitions.SERVICE_CENTER_TYPES_TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                unique: true,
                type: databaseDefinitions.EXTENSION_CITEXT
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
        queryInterface.createTable(serviceCenterTypeDefinitions.SERVICE_CENTER_TYPES_HISTORY_TABLE_NAME, {
            id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            name: {
                type: databaseDefinitions.EXTENSION_CITEXT
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable(serviceCenterTypeDefinitions.SERVICE_CENTER_TYPES_TABLE_NAME);
        queryInterface.dropTable(serviceCenterTypeDefinitions.SERVICE_CENTER_TYPES_HISTORY_TABLE_NAME);
    }
};