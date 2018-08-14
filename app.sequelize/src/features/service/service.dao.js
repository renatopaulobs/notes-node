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

const db = require('../../sequelize.models.js');
const constants = require('../../utils/constants');

const serviceDao = {
    getAll(user) {
        let whereQuery = {}
        if (user.UserType.id === constants.SERVICE_CENTER_ADMIN_TYPE_ID) {
            let serviceIdsLists = user.ServiceCenters.map(sc => {
                return sc.Services.map(service => {
                    if (service.isSCAdminAccess) {
                        return service.id;
                    }
                });
            });

            let serviceIds = [].concat.apply([], serviceIdsLists);

            whereQuery = { id: { $in: serviceIds } };
        }
        return db.Service.findAll({
            attributes: { exclude: 'sysPeriod' },
            where: whereQuery
        });
    }
};

module.exports = serviceDao;

