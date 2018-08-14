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
    SERVICE_CENTER_INACTIVE: 'Centro de Serviço inativo',
    SERVICE_CENTER_INVALID: 'Centro de Serviço inválido.',
    SERVICE_CENTER_NOT_FOUND: 'Centro de Serviço não encontrado.',
    THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_CODE: 'Já existe um Centro de Serviço com o código {0}',
    THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_NAME: 'Já existe um Centro de Serviço com o nome {0}',
    THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_DOC: 'Já existe um Centro de Serviço com o CNPJ {0}',
    CNPJ_INVALID: 'O CNPJ é inválido.',
    CNPJ_REQUIRED: 'O CNPJ é obrigatório.',
    CPF_INVALID: 'O CPF é inválido.',
    ZIPCODE_REQUIRED: 'O CEP é obrigatório',
    ZIPCODE_INVALID: 'O CEP é inválido',
    LIST_ID_SERVICE_CENTER_INVALID: 'A lista de identificadores dos centros de serviço deve conter apenas números',
    LIST_ID_SERVICE_CENTER_REQUIRED: 'A lista de identificadores dos centros de serviço é obrigatória',
    LIST_ID_SERVICE_CENTER_MAX: 'A lista de identificadores dos centros de serviço deve conter apenas um item. ',
    ERROR_DISABLE_SERVICE_CENTER: 'Um problema ocorreu ao desativar o Centro de Serviço. ' +
	'Alguns usuários podem ter sido inativados. Por favor, verifique o status dos usuários associados ao Centro de Serviço.',
    ERROR_INVALID_SERVICE_CENTER_ID: 'O identificador do Centro de Serviço não corresponde a um valor permitido.',

    // User
    THERE_IS_ALREADY_A_USER_WITH_THE_SAME_LOGIN: 'Já existe um usuário com o mesmo login.',
    THERE_IS_ALREADY_A_USER_WITH_THE_SAME_EMAIL: 'Já existe um usuário com o mesmo e-mail.',
    USER_DOES_NOT_EXIST: 'Usuário não encontrado.',
    USER_TYPE_NOT_FOUND: 'Tipo de usuário não encontrado.',
    USER_NAME_NOT_DEFINED: 'Nome do usuário não definido',
    USER_TYPE_INVALID: 'Tipo de usuário inválido.',
    USER_EMAIL_MAX_CHARACTER_EXCEEDED: 'Tamanho de caracteres excedido para o e-mail informado.',
    USER_COUNTRY_CODE: 'Código do país vazio',
    ERROR_FIND_CURRENT_USER: 'Erro ao consultar dados atuais do usuário',

    // General
    INVALID_INPUT: 'Entrada inválida'
};