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
module.exports = {
    NAME_MAX_LENGTH: 100,
    LOGIN_MIN_LENGTH: 4,
    LOGIN_MAX_LENGTH: 30,
    SERVICE_CENTER_NICKNAME_MAX_LENGTH: 50,
    EMAIL_MAX_LENGHT: 256,
    COUNTRY_CODE_MAX_LENGHT: 2,
    USER_TABLE_NAME: 'Users',
    USER_HISTORY_TABLE_NAME: 'UsersHistory',
    USERS_SERVICE_CENTERS_TABLE_NAME: 'UsersServiceCenters',
    USERS_SERVICE_CENTERS_HISTORY_TABLE_NAME: 'UsersServiceCentersHistory',
    LOGIN_COLUMN: 'login',
    EMAIL_COLUMN: 'email',
    LOGIN_FILTER_COLUMN: 'User.login',
    NAME_FILTER_COLUMN: 'User.name',
    USER_TYPE_ID_FILTER_COLUMN: 'User.userTypeId'

};