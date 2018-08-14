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


const internals = {};

exports.errors = {
    root: 'value',
    key: '{{!label}} ',
    messages: {
        wrapArrays: true
    },
    any: {
        unknown: 'não é permitido',
        invalid: 'contém um valor inválido',
        empty: 'não é permitido ser vazio',
        required: 'é obrigatorio',
        allowOnly: 'deve ser um entre {{valids}}',
        default: 'erro ao rodar um método padrão'
    },
    alternatives: {
        base: 'não corresponde a nenhuma das alternativas permitidas',
        child: null
    },
    array: {
        base: 'deve ser um array',
        includes: 'a posição {{pos}} não corresponde a nenhum tipo permitido',
        includesSingle: 'único valor de "{{!label}}" não corresponde a nenhum tipo permitido',
        includesOne: 'a posição {{pos}} falha porque {{reason}}',
        includesOneSingle: 'único valor de "{{!label}}" falha porque {{reason}}',
        includesRequiredUnknowns: 'não contém {{unknownMisses}} valor(es) requeridos',
        includesRequiredKnowns: 'não contém {{knownMisses}}',
        includesRequiredBoth: 'não contém {{knownMisses}} and {{unknownMisses}} outros valores requeridos',
        excludes: 'a posição {{pos}} contém um valor excluído',
        excludesSingle: 'único valor de "{{!label}}" contém um valor excluído',
        min: 'deve ter pelo menos {{limit}} caracteres',
        max: 'deve ter até {{limit}} itens',
        length: 'deve ter {{limit}} itens',
        ordered: 'a posição {{pos}} falha porque {{reason}}',
        orderedLength: 'a posição {{pos}} falha porque o array deve conter pelo menos {{limit}} itens',
        ref: 'referencia "{{ref}}" que não é um inteiro positivo',
        sparse: 'não deve ser um array esparço',
        unique: 'posição {{pos}} contém um valor duplicado'
    },
    boolean: {
        base: 'deve ser um booleano'
    },
    binary: {
        base: 'deve ser um buffer ou uma string',
        min: 'deve ter pelo menos {{limit}} bytes',
        max: 'deve ter até {{limit}} bytes',
        length: 'deve ter {{limit}} bytes'
    },
    date: {
        base: 'deve ser um número de milisegundos ou uma string de data válida',
        format: 'deve ser uma string com um dos seguintes formatos {{format}}',
        strict: 'deve ser uma data válida',
        min: 'de ser maior que ou igual a "{{limit}}"',
        max: 'deve ser menor que ou igual a "{{limit}}"',
        isoDate: 'deve ser uma data ISO 8601 válida',
        timestamp: {
            javascript: 'deve ser um timestamp válido ou um número de milisegundos',
            unix: 'deve ser um timestamp válido ou um número de segundos'
        },
        ref: 'referencia "{{ref}}" que não é uma data'
    },
    function: {
        base: 'deve ser uma função',
        arity: 'deve ter uma aridade de {{n}}',
        minArity: 'deve ter uma aridade maior que ou igual a {{n}}',
        maxArity: 'deve ter uma aridade menor que ou igual a {{n}}',
        ref: 'deve ser uma referência Joi',
        class: 'deve ser uma classe'
    },
    lazy: {
        base: '!!erro de esquema: esquema de lazy deve ser definido',
        schema: '!!erro de esquema: função de esquema lazy deve retornar um esquema'
    },
    object: {
        base: 'deve ser um objeto',
        child: '!!filho "{{!child}}" falha porque {{reason}}',
        min: 'deve ter pelo menos {{limit}} filhos',
        max: 'deve ter até {{limit}} filhos',
        length: 'deve ter {{limit}} filhos',
        allowUnknown: '!!"{{!child}}" não é permitido',
        with: '!!"{{mainWithLabel}}" faltando par obrigatório "{{peerWithLabel}}"',
        without: '!!"{{mainWithLabel}}" conflito com par proibido "{{peerWithLabel}}"',
        missing: 'deve conter pelo menos um de {{peersWithLabels}}',
        xor: 'contém um conflito entre pares exclusivos {{peersWithLabels}}',
        or: 'deve conter pelo menos um de {{peersWithLabels}}',
        and: 'contém {{presentWithLabels}} sem seus pares requeridos {{missingWithLabels}}',
        nand: '!!"{{mainWithLabel}}" não deve existir simultaneamente com {{peersWithLabels}}',
        assert: '!!validação de "{{ref}}" falhou porque "{{ref}}" falhou a {{message}}',
        rename: {
            multiple: 'não é possivel renomear filho "{{from}}" porque mudanças múltiplas de nome estão desabilitadas e outra chave já foi renomeada para "{{to}}"',
            override: 'não é possível renomear filho "{{from}}" porque sobreescrita está desabilitada e o alvo "{{to}}" existe',
            regex: {
                multiple: 'não é possível renomear filho {{from}} porque mudanças múltiplas de nome estão desabilitadas e outra chave já foi renomeada para "{{to}}"',
                override: 'não é possível renomear filho "{{from}}" porque sobreescrita está desabilitada e o alvo "{{to}}" existe'
            }
        },
        type: 'deve ser uma instância de "{{type}}"',
        schema: 'deve ser uma instância Joi'
    },
    number: {
        base: 'deve ser um número',
        min: 'deve ser maior que ou igual a {{limit}}',
        max: 'deve ser menor que ou igual a {{limit}}',
        less: 'deve ser menor que {{limit}}',
        greater: 'deve ser maior que {{limit}}',
        float: 'deve ser ponto flutuante ou double',
        integer: 'deve ser um inteiro',
        negative: 'deve ser um número negativo',
        positive: 'deve ser um número positivo',
        precision: 'não deve ter mais que {{limit}} casas decimais',
        ref: 'referencia "{{ref}}" o que não é um número',
        multiple: 'deve ser um múltiplo de {{multiple}}',
        port: 'deve ser uma porta válida'
    },
    string: {
        base: 'deve ser uma string',
        min: 'o tamanho deve ser de pelo menos {{limit}} caracteres',
        max: 'o tamanho deve ser menor que ou igual a {{limit}} caracteres',
        length: 'o tamanho deve ser {{limit}} caracteres',
        alphanum: 'deve conter apenas caracteres alfanuméricos',
        token: 'deve conter apenas caracteres alfanuméricos e sublinhado',
        regex: {
            base: 'o valor "{{!value}}" não corresponde o parametro requerido: {{pattern}}',
            name: '{{name}}',
            invert: {
                base: 'o valor "{{!value}}" corresponde ao padrão invertido: {{pattern}}',
                name: 'o valor "{{!value}}" corresponde ao padrão invertido {{name}}'
            }
        },
        email: 'deve ser um e-mail valido',
        uri: 'deve ser uma uri válida',
        uriRelativeOnly: 'deve ser uma uri relativa válida',
        uriCustomScheme: 'deve ser uma uri válida correspondendo ao padrãodo esquema {{scheme}}',
        isoDate: 'deve ser uma data ISO 8601 válida',
        guid: 'deve ser um GUID válido GUID',
        hex: 'deve conter apenas caracteres hexadecimais',
        hexAlign: 'representação hexadecimal deve ser alinhada byte a byte',
        base64: 'deve ser uma string base64 válida',
        hostname: 'deve ser um hostname válido',
        normalize: 'deve ser normalizado em unicode na forma {{form}}',
        lowercase: 'deve conter apenas caracteres minúsculos',
        uppercase: 'deve conter apenas caracteres maiúsculos',
        trim: 'não deve ter espaços em branco no início ou no final',
        creditCard: 'deve ser um cartão de crédito',
        ref: 'referencia "{{ref}}" o que não é um número',
        ip: ' deve ser um endereço ip válido com um CIDR {{cidr}}',
        ipVersion: 'deve ser um endereço ip válido com uma das seguintes versões {{version}} cum um CIDR {{cidr}}'
    }
};


