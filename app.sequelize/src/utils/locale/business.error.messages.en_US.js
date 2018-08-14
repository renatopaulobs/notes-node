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

const internals = {};

exports.errors = {
    // Service Center
    SERVICE_CENTER_INACTIVE: 'Service Center is inactive',
    SERVICE_CENTER_NOT_FOUND: 'Service Center not found.',
    SERVICE_CENTER_INVALID: 'Service Center is invalid',
    THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_CODE: 'There is already a Service Center with the code {0}',
    THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_NAME: 'There is already a Service Center with the name {0}',
    THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_DOC: 'There is already a Service Center with the juridical person document {0}',
    CNPJ_INVALID: 'The CNPJ is invalid.',
    CNPJ_REQUIRED: 'The CNPJ is required.',
    CPF_INVALID: 'The CPF is invalid.',
    ZIPCODE_REQUIRED: 'The Zip Code is required.',
    ZIPCODE_INVALID: 'The Zip Code is invalid.',
    LIST_ID_SERVICE_CENTER_INVALID: 'The list of Service Centers Ids should only contain numbers',
    LIST_ID_SERVICE_CENTER_REQUIRED: 'The list of Service Centers Ids is required',
    LIST_ID_SERVICE_CENTER_MAX: 'The list of Service Centers Ids should only contain one item. ',
    ERROR_DISABLE_SERVICE_CENTER: 'A problem occurred while deactivating the Service Center. ' +
    'Some users may have been disabled. Please check the status of users associated with the Service Center.',
    ERROR_INVALID_SERVICE_CENTER_ID: 'The Service Center identifier does not match an allowable value.',

    // User
    THERE_IS_ALREADY_A_USER_WITH_THE_SAME_LOGIN: 'A user with the same login already exists.',
    THERE_IS_ALREADY_A_USER_WITH_THE_SAME_EMAIL: 'A user with the same email already exists.',
    USER_DOES_NOT_EXIST: 'User does not exist.',
    USER_TYPE_NOT_FOUND: 'User Type not found.',
    USER_NAME_NOT_DEFINED: 'User name not defined',
    USER_TYPE_INVALID: 'User type is invalid.',
    USER_EMAIL_MAX_CHARACTER_EXCEEDED: 'Character size exceeded for the email.',
    USER_COUNTRY_CODE: 'Empty country code',
    ERROR_FIND_CURRENT_USER: 'Error querying current User Data',

    // General
    INVALID_INPUT: 'Invalid input'
};