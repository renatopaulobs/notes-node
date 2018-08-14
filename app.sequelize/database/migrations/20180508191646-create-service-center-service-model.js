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
const serviceCenterServiceDefinitions = require('../../src/features/service-center/service-center-service.definitions');
const serviceDefinitions = require('../../src/features/service/service.definitions');
const serviceCenterDefinitions = require('../../src/features/service-center/service-center.definitions');
module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.createTable(serviceCenterServiceDefinitions.SERVICE_CENTER_SERVICES_TABLE_NAME, {
            serviceId: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: serviceDefinitions.SERVICES_TABLE_NAME,
                    key: 'id'
                }
            },
            serviceCenterId: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: serviceCenterDefinitions.SERVICE_CENTERS_TABLE_NAME,
                    key: 'id'
                }
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
        queryInterface.createTable(serviceCenterServiceDefinitions.SERVICE_CENTER_SERVICES_HISTORY_TABLE_NAME, {
            serviceId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            serviceCenterId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable(serviceCenterServiceDefinitions.SERVICE_CENTER_SERVICES_TABLE_NAME);
        queryInterface.dropTable(serviceCenterServiceDefinitions.SERVICE_CENTER_SERVICES_HISTORY_TABLE_NAME);
    }
};