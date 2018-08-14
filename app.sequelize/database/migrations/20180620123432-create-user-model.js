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
const databaseDefinitions = require('../config/database.definitions');
const userDefinitions = require('../../src/features/user/user.definitions');
const userTypeDefinitions = require('../../src/features/user/user-type.definitions');

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.createTable(userDefinitions.USER_TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(userDefinitions.NAME_MAX_LENGTH)
            },
            login: {
                allowNull: false,
                unique: true,
                type: databaseDefinitions.EXTENSION_CITEXT
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING(userDefinitions.EMAIL_MAX_LENGHT)
            },
            isActive: {
                type: Sequelize.BOOLEAN
            },
            countryCode: {
                allowNull: false,
                type: Sequelize.STRING(userDefinitions.COUNTRY_CODE_MAX_LENGHT)
            },
            userTypeId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: userTypeDefinitions.USER_TYPES_TABLE_NAME,
                    key: 'id',
                    as: 'userTypeId'
                }
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
        queryInterface.createTable(userDefinitions.USER_HISTORY_TABLE_NAME, {
            id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(userDefinitions.NAME_MAX_LENGTH)
            },
            login: {
                type: databaseDefinitions.EXTENSION_CITEXT
            },
            email: {
                type: Sequelize.STRING(userDefinitions.EMAIL_MAX_LENGHT)
            },
            isActive: {
                type: Sequelize.BOOLEAN
            },
            countryCode: {
                type: Sequelize.STRING(userDefinitions.COUNTRY_CODE_MAX_LENGHT)
            },
            userTypeId: {
                type: Sequelize.INTEGER
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable(userDefinitions.USER_TABLE_NAME);
        queryInterface.dropTable(userDefinitions.USER_HISTORY_TABLE_NAME);
    }
};