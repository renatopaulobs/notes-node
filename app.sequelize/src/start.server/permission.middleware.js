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
const userBo = require('../features/user/user.bo');
const auth = require('../features/user/auth/auth.service.js');
const HttpStatus = require('http-status-codes');

module.exports = function permit(...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1; // No role found

    return (req, res, next) => {
        auth.getUser(req.cookies).then((user) => {
            userBo.getByLogin(user.data.Username).then((user) => {
                req.user = user;
                if (req.user && isAllowed(req.user.UserType.id))
                    next();
                else {
                    res.status(HttpStatus.FORBIDDEN).send();
                }});
        }).catch(err => res.status(HttpStatus.FORBIDDEN).send());
    };
};