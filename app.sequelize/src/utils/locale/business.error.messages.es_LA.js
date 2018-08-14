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
    SERVICE_CENTER_INACTIVE: 'Centro de Servicio inactivo',
    SERVICE_CENTER_NOT_FOUND: 'Centro de Servicio no encontrado.',
    SERVICE_CENTER_INVALID: 'Centro de Servicio inválido.',
    THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_CODE: 'Ya hay un servicio central con el código {0}',
    THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_NAME: 'Ya hay un servicio central con el nombre {0}',
    THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_DOC: 'Ya hay un servicio central con el documento de persona jurídica {0}',
    CNPJ_INVALID: 'El CNPJ es inválido',
    CNPJ_REQUIRED: 'El CNPJ es obrigatorio.',
    CPF_INVALID: 'El CPF es inválido.',
    ZIPCODE_REQUIRED: 'El Código postal es obrigatorio.',
    ZIPCODE_INVALID: 'El Código postal es inválido.',
    LIST_ID_SERVICE_CENTER_INVALID: 'La lista de identificadores de centros de servicio debe contener sólo números',
    LIST_ID_SERVICE_CENTER_REQUIRED: 'La lista de identificadores de centros de servicio es obligatoria',
    LIST_ID_SERVICE_CENTER_MAX: 'La lista de identificadores dos centros de serviciodebe contener sólo un elemento. ',
    ERROR_DISABLE_SERVICE_CENTER: 'Se ha producido un problema al deshabilitar el Centro de servicio. ' +
    'Algunos usuarios pueden haber sido inhabilitados. Por favor, verifique el estado de los usuarios asociados al Centro de servicio.',
    ERROR_INVALID_SERVICE_CENTER_ID: 'El identificador del Centro de servicio no coincide con un valor permitido.',

    // User
    THERE_IS_ALREADY_A_USER_WITH_THE_SAME_LOGIN: 'Ya existe un usuario con el mismo login.',
    THERE_IS_ALREADY_A_USER_WITH_THE_SAME_EMAIL: 'Ya existe un usuario con el mismo e-mail.',
    USER_DOES_NOT_EXIST: 'Usuario no encontrado.',
    USER_TYPE_NOT_FOUND: 'Tipo de usuario no encontrado.',
    USER_NAME_NOT_DEFINED: 'Nombre de usuario no definido',
    USER_TYPE_INVALID: 'Tipo de usuario inválido.',
    USER_EMAIL_MAX_CHARACTER_EXCEEDED: 'Tamaño de carácter excedido para el e-mail informado.',
    USER_COUNTRY_CODE: 'Código del país vacío',
    ERROR_FIND_CURRENT_USER: 'Error al consultar los datos de usuario actuales',

    // General
    INVALID_INPUT: 'Entrada no válida'
};