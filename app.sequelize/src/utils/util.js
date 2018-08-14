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

const CPF_MAX_LENGTH = 11;
const CNPJ_MAX_LENGTH = 14;
const CPF_REG_EXPRESSION = /(?!(\d)\1{8})\d{11}/;
const CNPJ_ONLY_ZEROS = '00000000000000';
const CNPJ_MAX_WEIGHT = 9;
const CPF_MAX_WEIGHT = 11;
const constants = require('../utils/constants');

function calculateVerificationDigit(documentNumber, maxWeight) {
    let sum = 0;
    let weight = 2;
    let limit = documentNumber.length - 1; // Because index starts in 0
    for (var i = 0; i <= limit; i++) {
        let digit = parseInt(String.fromCharCode(documentNumber.charCodeAt(documentNumber.length - i - 1)));// -1 because index starts on 0
        sum = sum + (digit * weight);

        if (++weight > maxWeight) {
            weight = 2; // backing to initial weight
        }
    }
    sum = 11 - sum % 11; // Validation numbers for CPF and CNPJ
    return sum > 9 ? 0 : sum;
}

function isValidBrazilianTwoVerificationDigitsDocument(documentNumber, maxLength, maxWeight) {
    if (documentNumber.length !== maxLength) {
        return false;
    } else {
        let endIndex = maxLength - 2; // The base document is the number until the penultimate digit of the document.
        let baseDocument = documentNumber.substring(0, endIndex);
        let firstDigit = calculateVerificationDigit(baseDocument, maxWeight);
        let secondDigit = calculateVerificationDigit(baseDocument + firstDigit, maxWeight);
        return documentNumber === ((baseDocument + firstDigit) + secondDigit);
    }
}

const isValidCPF = (cpf) => {
    if (!CPF_REG_EXPRESSION.test(cpf)) {
        return false;
    }

    return isValidBrazilianTwoVerificationDigitsDocument(cpf, CPF_MAX_LENGTH, CPF_MAX_WEIGHT);
};

const isValidCNPJ = (cnpj) => {
    if (cnpj === CNPJ_ONLY_ZEROS) {
        return false;
    }

    return isValidBrazilianTwoVerificationDigitsDocument(cnpj, CNPJ_MAX_LENGTH, CNPJ_MAX_WEIGHT);
};

const isValidCPForCNPJ = (documentNumber) => isValidCPF(documentNumber) || isValidCNPJ(documentNumber);

const isValidEmailSize = (email) => {
    let result = true;
    let emailSplited = email.split(constants.AT);

    // Verify first piece before '@'
    if (emailSplited[0].length > constants.MAX_LENGTH_EMAIL_PIECE) result = false;

    // Verify second piece of string by separating by '.'
    emailSplited[1].split(constants.DOT).forEach(element => {
        if (element.length >= constants.MAX_LENGTH_EMAIL_PIECE) result = false;
    });

    return result;
};

// Get boolean value
// This function must be used after Joi.boolean() validation to ensure greater cases coverage
// Test cases
//      getBool("true"); //true
//      getBool("false"); //false
//      getBool("TRUE"); //true
//      getBool("FALSE"); //false
const getBool = (val) => {
    return !!JSON.parse(String(val).toLowerCase());
};

const removeItemArray = (array, itemToRemove) => {
    // Find and remove item from an array
    var index = array.indexOf(itemToRemove);

    if (index !== -1) {
        array.splice(index, 1);
    }
    return array;
};

const isValidValueInteger = (number) => {
    if (Number.isInteger(number)) {
        if (number > constants.MAX_INTEGER || number < constants.MIN_INTEGER){
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};

module.exports = {
    isValidCPF,
    isValidCNPJ,
    isValidCPForCNPJ,
    isValidEmailSize,
    getBool,
    removeItemArray,
    isValidValueInteger
};