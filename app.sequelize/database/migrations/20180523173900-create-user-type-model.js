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

const userTypeDefinitions = require('../../src/features/user/user-type.definitions');
module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.createTable(userTypeDefinitions.USER_TYPES_TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(userTypeDefinitions.NAME_MAX_LENGTH)
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
        queryInterface.createTable(userTypeDefinitions.USER_TYPES_HISTORY_TABLE_NAME, {
            id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(userTypeDefinitions.NAME_MAX_LENGTH)
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable(userTypeDefinitions.USER_TYPES_TABLE_NAME);
        queryInterface.dropTable(userTypeDefinitions.USER_TYPES_HISTORY_TABLE_NAME);
    }
};