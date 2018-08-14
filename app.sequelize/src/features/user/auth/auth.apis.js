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
const COLON = ':';
const USER_PATH ='/v1/auth/user';
const USER_WITH_PATH_PARAM = '/v1/auth/user/{0}';
const USER_STATUS = '/v1/auth/user/{0}/status';

module.exports = {
    CREATE_USER: process.env.AUTH_MS_ENDPOINT.concat(COLON).concat(process.env.AUTH_MS_PORT).concat(USER_PATH),
    UPDATE_USER: process.env.AUTH_MS_ENDPOINT.concat(COLON).concat(process.env.AUTH_MS_PORT).concat(USER_WITH_PATH_PARAM),
    DELETE_USER: process.env.AUTH_MS_ENDPOINT.concat(COLON).concat(process.env.AUTH_MS_PORT).concat(USER_WITH_PATH_PARAM),
    CHANGE_STATUS: process.env.AUTH_MS_ENDPOINT.concat(COLON).concat(process.env.AUTH_MS_PORT).concat(USER_STATUS),
    GET_USER: process.env.AUTH_MS_ENDPOINT.concat(COLON).concat(process.env.AUTH_MS_PORT).concat(USER_PATH)
};