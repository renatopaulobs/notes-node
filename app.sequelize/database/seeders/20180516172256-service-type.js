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
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('ServiceCenterTypes', [
            {
                name: 'ASC'
            },
            {
                name: 'CRC'
            },
            {
                name: 'CSP'
            },
            {
                name: 'FSC'
            },
            {
                name: 'MSC'
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('ServiceCenterTypes', null, {});

    }
};
