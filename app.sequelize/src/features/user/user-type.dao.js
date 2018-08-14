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

const userTypeDao = {
    getUserTypeById(userTypeId) {
        return new Promise((resolve, reject) => {
            db.UserType.findById(userTypeId)
                .then((userType) => {
                    if (userType)
                        return resolve(userType);
                    else
                        return reject();
                }).catch((err) => {
                    return reject(err);
                });
        });
    },
    getAllUserTypes() {
        return db.UserType.findAll();
    }
};

module.exports = userTypeDao;


