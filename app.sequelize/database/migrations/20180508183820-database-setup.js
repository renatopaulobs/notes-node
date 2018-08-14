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
'use strict';

const databaseDefinitions = require('../config/database.definitions');

function createExtension(extension)
{
    return 'CREATE EXTENSION IF NOT EXISTS '+extension+';';
}

function dropExtension(extension)
{
    return 'DROP EXTENSION '+extension+';';
}

const createCitextExtension = createExtension(databaseDefinitions.EXTENSION_CITEXT);
const dropCitextExtension = dropExtension(databaseDefinitions.EXTENSION_CITEXT);

const createUnaccentExtension = createExtension(databaseDefinitions.EXTENSION_UNACCENT);
const dropUnaccentExtension = dropExtension(databaseDefinitions.EXTENSION_UNACCENT);

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.sequelize.query(createCitextExtension);
        queryInterface.sequelize.query(createUnaccentExtension);
    },
    down: (queryInterface, Sequelize) => {
        queryInterface.sequelize.query(dropCitextExtension);
        queryInterface.sequelize.query(dropUnaccentExtension);
    }
};