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
const serviceCenterDefinitions = require('../../src/features/service-center/service-center.definitions.js');
const serviceCenterTypeDefinitions = require('../../src/features/service-center/service-center-type.definitions.js');
module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.createTable(serviceCenterDefinitions.SERVICE_CENTERS_TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            code: {
                allowNull: false,
                unique: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: databaseDefinitions.EXTENSION_CITEXT
            },
            nickname: {
                allowNull: false,
                type: Sequelize.STRING(serviceCenterDefinitions.NICKNAME_MAX_LENGTH)
            },
            address: {
                allowNull: false,
                type: Sequelize.STRING(serviceCenterDefinitions.ADDRESS_MAX_LENGTH)
            },
            neighborhood: {
                allowNull: false,
                type: Sequelize.STRING(serviceCenterDefinitions.NEIGHBORHOOD_MAX_LENGTH)
            },
            zipCode: {
                type: Sequelize.STRING(serviceCenterDefinitions.ZIPCODE_MAX_LENGTH)
            },
            juridicalPersonDocument: {
                unique: true,
                type: databaseDefinitions.EXTENSION_CITEXT
            },
            phoneNumber: {
                type: Sequelize.STRING(serviceCenterDefinitions.PHONE_MAX_LENGTH)
            },
            email: {
                type: Sequelize.STRING(serviceCenterDefinitions.EMAIL_MAX_LENGTH)
            },
            ownerName: {
                allowNull: false,
                type: Sequelize.STRING(serviceCenterDefinitions.OWNER_NAME_MAX_LENGTH)
            },
            naturalPersonDocument: {
                type: Sequelize.STRING(serviceCenterDefinitions.NATURAL_PERSON_DOCUMENT_LENGTH)
            },
            ownerSignatureFileName: {
                type: Sequelize.TEXT
            },
            geolocalizationCountryName: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            geolocalizationCountryCode: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            geolocalizationStateName: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            geolocalizationStateCode: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            geolocalizationCityName: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            isActive: {
                type: Sequelize.BOOLEAN
            },
            serviceCenterTypeId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: serviceCenterTypeDefinitions.SERVICE_CENTER_TYPES_TABLE_NAME,
                    key: 'id',
                    as: 'serviceCenterTypeId'
                }
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
        queryInterface.createTable(serviceCenterDefinitions.SERVICE_CENTERS_HISTORY_TABLE_NAME, {
            id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            code: {
                type: Sequelize.INTEGER
            },
            name: {
                type: databaseDefinitions.EXTENSION_CITEXT
            },
            nickname: {
                type: Sequelize.STRING(serviceCenterDefinitions.NICKNAME_MAX_LENGTH)
            },
            address: {
                type: Sequelize.STRING(serviceCenterDefinitions.ADDRESS_MAX_LENGTH)
            },
            neighborhood: {
                type: Sequelize.STRING(serviceCenterDefinitions.NEIGHBORHOOD_MAX_LENGTH)
            },
            zipCode: {
                type: Sequelize.STRING(serviceCenterDefinitions.ZIPCODE_MAX_LENGTH)
            },
            juridicalPersonDocument: {
                type: databaseDefinitions.EXTENSION_CITEXT
            },
            phoneNumber: {
                type: Sequelize.STRING(serviceCenterDefinitions.PHONE_MAX_LENGTH)
            },
            email: {
                type: Sequelize.STRING(serviceCenterDefinitions.EMAIL_MAX_LENGTH)
            },
            ownerName: {
                type: Sequelize.STRING(serviceCenterDefinitions.OWNER_NAME_MAX_LENGTH)
            },
            naturalPersonDocument: {
                type: Sequelize.STRING(serviceCenterDefinitions.NATURAL_PERSON_DOCUMENT_LENGTH)
            },
            ownerSignatureFileName: {
                type: Sequelize.TEXT
            },
            geolocalizationCountryName: {
                type: Sequelize.TEXT
            },
            geolocalizationCountryCode: {
                type: Sequelize.TEXT
            },
            geolocalizationStateName: {
                type: Sequelize.TEXT
            },
            geolocalizationStateCode: {
                type: Sequelize.TEXT
            },
            geolocalizationCityName: {
                type: Sequelize.TEXT
            },
            isActive: {
                type: Sequelize.BOOLEAN
            },
            serviceCenterTypeId: {
                type: Sequelize.INTEGER
            },
            sysPeriod: {
                type: Sequelize.RANGE(Sequelize.DATE)
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable(serviceCenterDefinitions.SERVICE_CENTERS_TABLE_NAME);
        queryInterface.dropTable(serviceCenterDefinitions.SERVICE_CENTERS_HISTORY_TABLE_NAME);
    }
};