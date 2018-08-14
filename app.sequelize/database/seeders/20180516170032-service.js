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
        return queryInterface.bulkInsert('Services', [{
            name: 'QLess',
            logoFileName: 'https://s3.us-east-2.amazonaws.com/lsacd-public-images/qless_image.png',
            url: 'https://www.qlessurlfake.com.br',
            uuId: '590e00f2-a836-4736-96cf-b0036be386bc',
            isSCAdminAccess: false
        },
        {
            name: 'Laudo Técnico',
            logoFileName: 'https://s3.us-east-2.amazonaws.com/lsacd-public-images/technical_report_image.png',
            url: 'https://www.laudourlfake.com.br',
            uuId: 'e2eb8e6d-3dcc-4558-bffe-c6acb21f2f4d',
            isSCAdminAccess: true
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Services', null, {});
    }
};
