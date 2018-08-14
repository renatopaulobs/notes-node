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

const serviceCenterDefinitions = require('../../src/features/service-center/service-center.definitions');
const userDefinitions = require('../../src/features/user/user.definitions');

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.createTable(userDefinitions.USERS_SERVICE_CENTERS_TABLE_NAME, {
            serviceCenterId: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: serviceCenterDefinitions.SERVICE_CENTERS_TABLE_NAME,
                    key: 'id'
                }
            },
            userId: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: userDefinitions.USER_TABLE_NAME,
                    key: 'id'
                }
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
        queryInterface.createTable(userDefinitions.USERS_SERVICE_CENTERS_HISTORY_TABLE_NAME, {
            serviceCenterId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable(userDefinitions.USERS_SERVICE_CENTERS_TABLE_NAME);
        queryInterface.dropTable(userDefinitions.USERS_SERVICE_CENTERS_HISTORY_TABLE_NAME);
    }
};