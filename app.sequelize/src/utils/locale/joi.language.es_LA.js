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
    key: '"{{!label}}" ',
    messages: {
        wrapArrays: true
    },
    any: {
        unknown: 'no se permite',
        invalid: 'contiene un valor inválido',
        empty: 'no está permitido estar vacío',
        required: 'es necesario',
        allowOnly: 'debe ser un de {{valids}}',
        default: 'lanzó un error al ejecutar el método predeterminado'
    },
    alternatives: {
        base: 'no concuerda con ninguna de las alternativas permitidas',
        child: null
    },
    array: {
        base: 'debe ser un array',
        includes: 'la posición {{pos}} no coincide con ninguno de los tipos permitidos',
        includesSingle: 'valor único de "{{!label}}" no coincide con ninguno de los tipos permitidos',
        includesOne: 'la posición {{pos}} falla porque {{reason}}',
        includesOneSingle: 'valor único de "{{!label}}" falla porque {{reason}}',
        includesRequiredUnknowns: 'no contiene {{unknownMisses}} valore(s) requerido(s)',
        includesRequiredKnowns: 'no contiene {{knownMisses}}',
        includesRequiredBoth: 'no contiene {{knownMisses}} e {{unknownMisses}} otro(s) valor(es) requerido(s)',
        excludes: 'la posición {{pos}} contiene un valor excluido',
        excludesSingle: 'valor único de "{{!label}}" contiene un valor excluido',
        min: 'debe tener el tamaño mínimo de {{limit}} caracteres',
        max: 'debe contener menos que o igual a {{limit}} ítens',
        length: 'debe contener {{limit}} ítens',
        ordered: 'la posición {{pos}} falla porque {{reason}}',
        orderedLength: 'la posición {{pos}} falla porque la matriz debe contener como máximo {{limit}} items',
        ref: 'poner referencias a "{{ref}}" que no es un entero positivo',
        sparse: 'no debe ser un array disperso',
        unique: 'posición {{pos}} contiene un valor duplicado'
    },
    boolean: {
        base: 'debe ser un booleano'
    },
    binary: {
        base: 'debe ser un buffer o una string',
        min: 'al menos debe ser {{limit}} bytes',
        max: 'debe ser menor o igual que {{limit}} bytes',
        length: 'debe ser {{limit}} bytes'
    },
    date: {
        base: 'debe ser un número de milisegundos o string de fecha válida',
        format: 'debe ser una string con uno de los siguientes formatos {{format}}',
        strict: 'Debe ser una fecha válida',
        min: 'debe ser mayor o igual que "{{limit}}"',
        max: 'debe ser menor o igual que "{{limit}}"',
        isoDate: 'debe ser una fecha válida de ISO 8601',
        timestamp: {
            javascript: 'debe ser una marca de tiempo válida o una cantidad de milisegundos',
            unix: 'debe ser una marca de tiempo válida o una cantidad de segundos'
        },
        ref: 'poner referencias a"{{ref}}" que no es una fecha'
    },
    function: {
        base: 'debe ser una función',
        arity: 'debe tener una aridad de {{n}}',
        minArity: 'debe tener una aridad mayor o igual a {{n}}',
        maxArity: 'debe tener una aridad menor o igual a {{n}}',
        ref: 'debe ser una referencia Joi',
        class: 'debe ser una clase'
    },
    lazy: {
        base: '!!error de esquema: se debe establecer un esquema diferido',
        schema: '!!error de esquema: la función de esquema diferido debe devolver un esquema'
    },
    object: {
        base: 'debe ser un objeto',
        child: '!!niño "{{!child}}" falla porque {{reason}}',
        min: 'debe tener al menos {{limit}} niños',
        max: 'debe tener menos de o igual a {{limit}} niños',
        length: 'debe tener {{limit}} niños',
        allowUnknown: '!!"{{!child}}" no se permite',
        with: '!!"{{mainWithLabel}}" par requerido faltante "{{peerWithLabel}}"',
        without: '!!"{{mainWithLabel}}" conflicto con un par prohibido "{{peerWithLabel}}"',
        missing: 'debe contener al menos uno de {{peersWithLabels}}',
        xor: 'contiene un conflicto entre pares exclusivos {{peersWithLabels}}',
        or: 'debe contener al menos uno de {{peersWithLabels}}',
        and: 'contiene {{presentWithLabels}} sin sus pares requeridos {{missingWithLabels}}',
        nand: '!!"{{mainWithLabel}}" no debe existir simultáneamente con {{peersWithLabels}}',
        assert: '!!"{{ref}}" validación fallida porque "{{ref}}" fallado a {{message}}',
        rename: {
            multiple: 'no se puede cambiar el nombre del niño "{{from}}" porque hay varios cambios de nombre deshabilitados y otra clave ya fue renombrada a "{{to}}"',
            override: 'no se puede cambiar el nombre del niño "{{from}}" porque la anulación está deshabilitada y el objetivo "{{to}}" existe',
            regex: {
                multiple: 'no se puede cambiar el nombre del niño "{{from}}" porque hay varios cambios de nombre deshabilitados y otra clave ya fue renombrada a "{{to}}"',
                override: 'no se puede cambiar el nombre del niño "{{from}}" porque la anulación está deshabilitada y el objetivo "{{to}}" existe'
            }
        },
        type: 'debe ser una instancia de "{{type}}"',
        schema: 'debe ser una instancia de Joi'
    },
    number: {
        base: 'tiene que ser un número',
        min: 'debe ser mayor o igual que {{limit}}',
        max: 'debe ser menor o igual que {{limit}}',
        less: 'debe ser menor que {{limit}}',
        greater: 'debe ser mayor que {{limit}}',
        float: 'debe ser un flotador o doble',
        integer: 'debe ser un entero',
        negative: 'debe ser un número negativo',
        positive: 'debe ser un número positivo',
        precision: 'no debe tener más que {{limit}} casas decimales',
        ref: 'poner referencias a "{{ref}}" que no es un número',
        multiple: 'debe ser un múltiplo de {{multiple}}',
        port: 'debe ser una puerta válido'
    },
    string: {
        base: 'debe ser una string',
        min: 'la longitud debe ser de al menos {{limit}} caracteres',
        max: 'la longitud debe ser menor o igual a {{limit}} caracteres',
        length: 'la longitud debe ser {{limit}} caracteres',
        alphanum: 'solo debe contener caracteres alfanuméricos',
        token: 'solo debe contener caracteres alfanuméricos y de subrayado',
        regex: {
            base: 'con valor "{{!value}}" no coincide con el patrón requerido: {{pattern}}',
            name: '{{name}}',
            invert: {
                base: 'con valor "{{!value}}" coincide con el patrón invertido: {{pattern}}',
                name: 'con valor "{{!value}}" coincide con el patrón invertido {{name}}'
            }
        },
        email: 'debe ser un correo electrónico válido',
        uri: 'debe ser un uri válido',
        uriRelativeOnly: 'debe ser un uri relativo válido',
        uriCustomScheme: 'debe ser un uri válido con un esquema que coincida con el patrón {{scheme}}',
        isoDate: 'debe ser una fecha válida de ISO 8601',
        guid: 'debe ser un GUID válido',
        hex: 'solo debe contener caracteres hexadecimales',
        hexAlign: 'la representación decodificada hex debe estar alineada por byte',
        base64: 'debe ser una cadena base64 válida',
        hostname: 'debe ser un nombre de host válido',
        normalize: 'debe ser unicode normalizado en el el formulario {{form}}',
        lowercase: 'solo debe contener caracteres en minúsculas',
        uppercase: 'solo debe contener caracteres en mayúscula',
        trim: 'no debe tener espacios en blanco iniciales o finales',
        creditCard: 'debe ser una tarjeta de crédito',
        ref: 'poner referencias a "{{ref}}" que no es un número',
        ip: 'debe ser una dirección IP válida con un CIDR {{cidr}}',
        ipVersion: 'debe ser una dirección IP válida de una de las siguientes versiones {{version}} con un CIDR {{cidr}}'
    }
};
