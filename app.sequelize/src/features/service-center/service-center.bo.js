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
const INDEX_OF_NOT_FOUND = -1;
const FORBIDDEN = 'FORBIDDEN';

const serviceCenterDao = require('./service-center.dao.js');
const businessError = require('../../utils/business.error');
const HttpStatus = require('http-status-codes');
const format = require('string-format');
const I18NHelper = require('../../utils/locale/I18N.helper');
const constants = require('../../utils/constants');
const definitions = require('./service-center.definitions.js');
const utils = require('../../utils/util');
const userDao = require('../user/user.dao.js');
const userTypeDefinitions = require('../user/user-type.definitions.js');
const authService = require('../user/auth/auth.service.js');
var countryCodeBrazil = 'BR';


function daoErrorsHandler(err, serviceCenter) {
    if (err.name === constants.SEQUELIZE_UNIQUE_CONSTRAINT_ERROR) {
        let field = err.errors.map(dt => dt.path);
        if (field[0] === definitions.JURIDICAL_PERSON_DOCUMENT_COLUMN) {
            return new businessError(format(I18NHelper.getBusinessErrorMessages().THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_DOC, serviceCenter.juridicalPersonDocument), HttpStatus.BAD_REQUEST);
        } else if (field[0] === definitions.CODE_COLUMN) {
            return new businessError(format(I18NHelper.getBusinessErrorMessages().THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_CODE, serviceCenter.code), HttpStatus.BAD_REQUEST);
        }
    }
    else {
        return err;
    }
}

function validateBrazilianFields(serviceCenter) {
    if (serviceCenter.geolocalizationCountryCode === countryCodeBrazil) {
        if (!serviceCenter.juridicalPersonDocument) {
            return I18NHelper.getBusinessErrorMessages().CNPJ_REQUIRED;
        }
        else if (!utils.isValidCNPJ(serviceCenter.juridicalPersonDocument)) {
            return I18NHelper.getBusinessErrorMessages().CNPJ_INVALID;
        }

        if (serviceCenter.naturalPersonDocument && !utils.isValidCPF(serviceCenter.naturalPersonDocument)) {
            return I18NHelper.getBusinessErrorMessages().CPF_INVALID;
        }

        if (!serviceCenter.zipCode) {
            return I18NHelper.getBusinessErrorMessages().ZIPCODE_REQUIRED;
        } else if (serviceCenter.zipCode.length !== definitions.BR_ZIPCODE_MAX_LENGTH) {
            return I18NHelper.getBusinessErrorMessages().ZIPCODE_INVALID;
        }
    }
    return constants.EMPTY_STRING;
}

const serviceCenterBo = {
    save(serviceCenter, serviceCenterId, signatureImage, requestUser) {
        return new Promise((resolve, reject) => {
            let brazilianFieldsValidationMessage = validateBrazilianFields(serviceCenter);
            let serviceCenterIdValueCreate = 0;

            if (brazilianFieldsValidationMessage) {
                reject(new businessError(brazilianFieldsValidationMessage, HttpStatus.BAD_REQUEST));
                return;
            }
            serviceCenterDao.validateByCodeNameAndJuridicalDocument(serviceCenter, serviceCenterId)
                .then(() => {
                    if (serviceCenterId === serviceCenterIdValueCreate) {
                        resolve(this.create(serviceCenter, signatureImage));
                    } else {
                        if (requestUser.UserType.id === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_ADMIN) {
                            let ids = requestUser.ServiceCenters.map(sc => sc.id);
                            if (ids.indexOf(serviceCenterId) === INDEX_OF_NOT_FOUND) {
                                return reject(new businessError(FORBIDDEN, HttpStatus.FORBIDDEN));
                            }
                        }
                        resolve(this.update(serviceCenterId, serviceCenter, signatureImage));
                    }
                })
                .catch((serviceCenterInDB) => {
                    if (serviceCenterInDB.code == serviceCenter.code) {
                        reject(new businessError(format(I18NHelper.getBusinessErrorMessages().THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_CODE, serviceCenter.code), HttpStatus.BAD_REQUEST));
                        return;
                    } else if (serviceCenterInDB.juridicalPersonDocument === serviceCenter.juridicalPersonDocument) {
                        reject(new businessError(format(I18NHelper.getBusinessErrorMessages().THERE_IS_ALREADY_A_SERVICE_CENTER_WITH_THE_DOC, serviceCenter.juridicalPersonDocument), HttpStatus.BAD_REQUEST));
                        return;
                    }
                });
        });
    },
    create(serviceCenter, signatureImage) {
        return new Promise((resolve, reject) => {
            serviceCenter.isActive = true;
            serviceCenterDao.create(serviceCenter, signatureImage)
                .then(serviceCenter => { resolve(serviceCenter); })
                .catch((err) => { reject(daoErrorsHandler(err, serviceCenter)); });
        });
    },
    update(serviceCenterId, serviceCenter, signatureImage) {
        return new Promise((resolve, reject) => {
            serviceCenterDao
                .update(serviceCenterId, serviceCenter, signatureImage)
                .then(([rowsUpdate, [updatedServiceCenter]]) => {
                    if (rowsUpdate === 0) {
                        reject(new businessError(I18NHelper.getBusinessErrorMessages().SERVICE_CENTER_NOT_FOUND, HttpStatus.NOT_FOUND));
                    }
                    else {
                        resolve(updatedServiceCenter);
                    }
                }).catch((err) => {
                    reject(daoErrorsHandler(err, serviceCenter));
                });
        });
    },
    updateStatus(serviceCenterId, status) {
        return new Promise((resolve, reject) => {
            let isActive;
            let loginUsersToUpdate = new Array();
            let oldSCStatus;

            try {
                isActive = utils.getBool(status);
            }
            catch (error) {
                return reject(new businessError(I18NHelper.getBusinessErrorMessages().INVALID_INPUT, HttpStatus.BAD_REQUEST));
            }
            serviceCenterDao.getById(serviceCenterId).then(serviceCenter => {
                oldSCStatus = serviceCenter.isActive;

                serviceCenterDao.updateStatus(serviceCenterId, isActive)
                    .then(([rowsUpdate]) => {
                        if (rowsUpdate === 0) {
                            reject(new businessError(I18NHelper.getBusinessErrorMessages().SERVICE_CENTER_NOT_FOUND, HttpStatus.NOT_FOUND));
                        }
                        else if (isActive) {
                            return resolve();
                        }
                        else {
                            userDao.getActiveUsersBySCIdAndUserType(serviceCenterId, userTypeDefinitions.USER_TYPE_SERVICE_CENTER_USER)
                                .then(users => {
                                    if (users.length > 0) {
                                        users.forEach(user => {
                                            loginUsersToUpdate.push(user.login);
                                        });

                                        userDao.disableUsers(loginUsersToUpdate)
                                            .then(([rowsUpdate]) => {
                                                if (rowsUpdate === 0) {
                                                    // Rollback status service center
                                                    serviceCenterDao.updateStatus(serviceCenterId, oldSCStatus)
                                                        .then(() => {
                                                            return reject(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_DISABLE_SERVICE_CENTER, HttpStatus.INTERNAL_SERVER_ERROR));
                                                        }).catch(() => {
                                                            return reject(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_DISABLE_SERVICE_CENTER, HttpStatus.INTERNAL_SERVER_ERROR));
                                                        });
                                                } else {
                                                    users.forEach(user => {
                                                        user.isActive = false;
                                                        authService.changeUserStatus(user)
                                                            .then((userCognitoUpdated) => {
                                                                loginUsersToUpdate = utils.removeItemArray(loginUsersToUpdate, userCognitoUpdated.username);

                                                                if (loginUsersToUpdate.length === 0) {
                                                                    return resolve();
                                                                }
                                                            })
                                                            .catch(error => {
                                                                // Rollback status users
                                                                userDao.enableUsers(loginUsersToUpdate)
                                                                    .then(() => {
                                                                        // Rollback status service center
                                                                        serviceCenterDao.updateStatus(serviceCenterId, oldSCStatus)
                                                                            .then(() => {
                                                                                return reject(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_DISABLE_SERVICE_CENTER, HttpStatus.INTERNAL_SERVER_ERROR));
                                                                            }).catch(() => {
                                                                                return reject(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_DISABLE_SERVICE_CENTER, HttpStatus.INTERNAL_SERVER_ERROR));
                                                                            });
                                                                    })
                                                                    .catch(() => {
                                                                        // Rollback status service center
                                                                        serviceCenterDao.updateStatus(serviceCenterId, oldSCStatus)
                                                                            .then(() => {
                                                                                return reject(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_DISABLE_SERVICE_CENTER, HttpStatus.INTERNAL_SERVER_ERROR));
                                                                            }).catch(() => {
                                                                                return reject(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_DISABLE_SERVICE_CENTER, HttpStatus.INTERNAL_SERVER_ERROR));
                                                                            });
                                                                    });
                                                            });
                                                    });

                                                }
                                            }).catch(error => {
                                                // Rollback status service center
                                                serviceCenterDao.updateStatus(serviceCenterId, oldSCStatus)
                                                    .then(() => {
                                                        return reject(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_DISABLE_SERVICE_CENTER, HttpStatus.INTERNAL_SERVER_ERROR));
                                                    }).catch(() => {
                                                        return reject(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_DISABLE_SERVICE_CENTER, HttpStatus.INTERNAL_SERVER_ERROR));
                                                    });
                                            });
                                    } else {
                                        return resolve();
                                    }
                                }).catch(error => {
                                    // Rollback status service center
                                    serviceCenterDao.updateStatus(serviceCenterId, oldSCStatus)
                                        .then(() => {
                                            return reject(error);
                                        }).catch(() => {
                                            return reject(error);
                                        });
                                });
                        }
                    }).catch((err) => {
                        return reject(err);
                    });
            }).catch((error) => {
                if (error) {
                    return reject(error);
                } else {
                    return reject(new businessError(I18NHelper.getBusinessErrorMessages().SERVICE_CENTER_NOT_FOUND, HttpStatus.NOT_FOUND));
                }
            });
        });
    },
    getById(serviceCenterId, error) {
        return new Promise((resolve, reject) => {
            serviceCenterDao.getById(serviceCenterId).then((serviceCenter) => {
                resolve(serviceCenter);
            }).catch(() => {
                return reject(new businessError(I18NHelper.getBusinessErrorMessages().SERVICE_CENTER_NOT_FOUND, HttpStatus.NOT_FOUND));
            });
        });
    },
    getAll(params, user) {
        return new Promise((resolve, reject) => {
            if (user.UserType.id === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_ADMIN) {
                params.SCIds = user.ServiceCenters.map(sc => sc.id);
            }
            resolve(serviceCenterDao.getAll(params));
        });
    },
    getServiceCenterByNickname(serviceCenterNickname) {
        return new Promise((resolve, reject) => {
            resolve(serviceCenterDao.getServiceCenterByNickname(serviceCenterNickname));
        });
    },
    associateServices(associationLists) {
        return new Promise((resolve, reject) => {
            resolve(serviceCenterDao.associateServices(associationLists));
        });
    },
    getServiceCenterByListId(serviceCenterIds) {
        return new Promise((resolve, reject) => {
            serviceCenterDao.getServiceCenterByListId(serviceCenterIds)
                .then((serviceCenters) => {
                    return resolve(serviceCenters);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    },
    getAllServiceCenterTypes() {
        return new Promise((resolve, reject) => {
            resolve(serviceCenterDao.getAllServiceCenterTypes());
        });
    }
};
module.exports = serviceCenterBo;