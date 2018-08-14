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

const locale = require('locale');
let defaultLanguage = 'pt_BR';
let supportedLanguages = [defaultLanguage, 'en_US', 'es_LA'];
let requestLanguage = defaultLanguage;

const joiLanguageBasePath = './joi.language.';
const joiCustomMessageBasePath = './joi.custom.messages.';
const businessErrorLanguageBasePath = './business.error.messages.';
const labelLanguageBasePath = './label.';

const defaultJoiLanguagePath = joiLanguageBasePath + defaultLanguage;
const defaultJoiCustomMessagePath = joiCustomMessageBasePath + defaultLanguage;
const defaultBusinessErrorLanguagePath = businessErrorLanguageBasePath + defaultLanguage;
const defaultLabelLanguagePath = labelLanguageBasePath + defaultLanguage;

function getLanguage(languageBasePath, defaultLanguagePath) {
    let selectedLanguage = require(languageBasePath + requestLanguage);

    if (!selectedLanguage) {
        selectedLanguage = require(defaultLanguagePath);
    }
    return selectedLanguage;
}

module.exports =
    {
        setRequestLanguage(req) {
            // The I18N is currently off. To turn it on again, replace the line bellow for "requestLanguage = req.locale;"
            requestLanguage = defaultLanguage;
        },

        getJoiMessages() {
            let selectedJoiLanguage = getLanguage(joiLanguageBasePath, defaultJoiLanguagePath);

            return selectedJoiLanguage.errors;
        },

        getBusinessErrorMessages() {
            let bussinessErrorLanguage = getLanguage(businessErrorLanguageBasePath, defaultBusinessErrorLanguagePath);

            return bussinessErrorLanguage.errors;
        },

        getLabels() {
            let labelLanguage = getLanguage(labelLanguageBasePath, defaultLabelLanguagePath);

            return labelLanguage.labels;
        },
        getJoiCustomMessages() {

            let joiCustomMessageLanguage = getLanguage(joiCustomMessageBasePath, defaultJoiCustomMessagePath);

            return joiCustomMessageLanguage.errors;
        },

        defaultLanguage,
        supportedLanguages
    };