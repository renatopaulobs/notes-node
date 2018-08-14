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

const STRING_REPLACE = '{0}';
const axios = require('axios');
const authAPIs = require('./auth.apis');
const businessError = require('../../../utils/business.error');

const authService = {
    createUser(user) {
        return new Promise((resolve, reject) => {
            const url = authAPIs.CREATE_USER;
            axios.post(url, user).then(function (response) {
                return resolve(response);
            }).catch(error => {
                return reject(errorHandler(error));
            });
        });
    },
    updateUser(username, user) {
        return new Promise((resolve, reject) => {
            const url = authAPIs.UPDATE_USER.replace('{0}', username);
            axios.put(url, user).then(function (response) {
                return resolve(response);
            }).catch(error => {
                return reject(errorHandler(error));
            });
        });
    },
    deleteUser(username, user) {
        return new Promise((resolve, reject) => {
            const url = authAPIs.DELETE_USER.replace('{0}', username);
            axios.delete(url, user).then(function (response) {
                return resolve(response);
            }).catch(error => {
                return reject(errorHandler(error));
            });
        });
    },
    changeUserStatus(userCognitoToBeChanged) {
        return new Promise((resolve, reject) => {
            const url = authAPIs.CHANGE_STATUS.replace('{0}', userCognitoToBeChanged.login);
            axios.put(url, { 'isActive': userCognitoToBeChanged.isActive }).then(function (response) {
                return resolve(response.data);
            }).catch(error => {
                return reject(errorHandler(error));
            });
        });
    },
    getUser(cookies) {
        return new Promise((resolve, reject) => {
            const url = authAPIs.GET_USER;
            let fullCookie = JSON.parse(Buffer.from(cookies.FullCookie, 'base64'));
            axios.get(url, { headers: {
                Cookie: 'AccessToken=' + fullCookie.accessToken + ';'
            } }).then(function (response) {
                return resolve(response);
            }).catch(function (error) {
                return reject(error);
            });
        });
    }
};
module.exports = authService;

function errorHandler(error){
    if (error.response.data.errors){
        return new businessError(error.response.data.errors, error.response.status);
    } else {
        return new businessError(error.response, error.response.status);
    }
}