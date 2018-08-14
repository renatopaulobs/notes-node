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

const businessError = require('../../utils/business.error');
const HttpStatus = require('http-status-codes');
const format = require('string-format');
const I18NHelper = require('../../utils/locale/I18N.helper');
const serviceCenterBo = require('../service-center/service-center.bo');
const userDao = require('./user.dao');
const utils = require('../../utils/util');
const cognitoMessages = require('./cognito.messages');
const constants = require('../../utils/constants');
const userDefinitions = require('./user.definitions');
const userTypeDefinitions = require('./user-type.definitions');
const authService = require('./auth/auth.service');

function validateGetPermission(userTypes, possibleTypes) {
    let results = userTypes.map(element => {
        if (possibleTypes.indexOf(parseInt(element)) === -1) {
            return false;
        }
        return true;
    });

    return results.reduce((total, current) => { return total && current; });
}

const userBo = {
    getAll(params, user) {
        return new Promise(async (resolve, reject) => {
            let usersIds;
            if (user.UserType.id === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_ADMIN) {
                usersIds = await userDao.getAssociatedUsers(user.ServiceCenters.map(sc => sc.id));
                usersIds = usersIds.map(u => u.userId);
                params.usersIds = usersIds;
                let possibleTypes = [userTypeDefinitions.USER_TYPE_SERVICE_CENTER_USER];
                if (params.userType) {
                    if (!validateGetPermission(params.userType, possibleTypes)) {
                        return reject(new businessError('', HttpStatus.BAD_REQUEST));
                    }
                }
            } else if (user.UserType.id === userTypeDefinitions.USER_TYPE_SAMSUNG_ADMIN) {
                let possibleTypes = [userTypeDefinitions.USER_TYPE_SAMSUNG_ADMIN, userTypeDefinitions.USER_TYPE_SERVICE_CENTER_ADMIN, userTypeDefinitions.USER_TYPE_SERVICE_CENTER_USER];
                if (!params.userType) {
                    params.userType = possibleTypes;
                } else {
                    if (!validateGetPermission(params.userType, possibleTypes)) {
                        return reject(new businessError('', HttpStatus.BAD_REQUEST));
                    }
                }
            }
            userDao.getAll(params)
                .then(user => {
                    return resolve(user);
                }).catch(error => {
                    reject(error);
                });
        });
    },

    createUser(user, loggedUser) {
        return new Promise((resolve, reject) => {
            if (loggedUser && !validatePermissions(user, loggedUser, false)) {
                return reject(new businessError('', HttpStatus.BAD_REQUEST));
            }
            user.countryCode = process.env.COUNTRY_CODE;
            user.login = user.login.toLowerCase();
            let userCognito = user;
            userCognito.SCNickname = '';

            if (!utils.isValidEmailSize(user.email)) {
                return reject(new businessError(I18NHelper.getBusinessErrorMessages().USER_EMAIL_MAX_CHARACTER_EXCEEDED, HttpStatus.BAD_REQUEST));
            }

            // User Type validation
            userBo.getUserTypeById(user.userTypeId)
                .then(userType => {

                    if (user.userTypeId === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_ADMIN ||
                        user.userTypeId === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_USER) {

                        // Service Center validation
                        if (!user.serviceCenterIds || user.serviceCenterIds.length === 0) {
                            return reject(new businessError(I18NHelper.getBusinessErrorMessages().LIST_ID_SERVICE_CENTER_REQUIRED, HttpStatus.BAD_REQUEST));
                        }

                        if (!Array.isArray(user.serviceCenterIds)) {
                            return reject(new businessError(I18NHelper.getBusinessErrorMessages().LIST_ID_SERVICE_CENTER_INVALID, HttpStatus.BAD_REQUEST));
                        }

                        let maxServiceCentersForSCUser = 1;

                        if (user.userTypeId === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_USER && user.serviceCenterIds.length > maxServiceCentersForSCUser) {
                            return reject(new businessError(I18NHelper.getBusinessErrorMessages().LIST_ID_SERVICE_CENTER_MAX, HttpStatus.BAD_REQUEST));
                        }

                        if (user.serviceCenterIds) {
                            serviceCenterBo.getServiceCenterByListId(user.serviceCenterIds)
                                .then((listServiceCenters) => {
                                    if (user.serviceCenterIds.length !== listServiceCenters.length) {
                                        return reject(new businessError(I18NHelper.getBusinessErrorMessages().SERVICE_CENTER_INVALID, HttpStatus.BAD_REQUEST));
                                    }

                                    // Email validation
                                    if (user.userTypeId === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_ADMIN) {
                                        userDao.getByEmail(user.email)
                                            .then(users => {
                                                if (users.length > 0) {
                                                    return reject(new businessError(I18NHelper.getBusinessErrorMessages().THERE_IS_ALREADY_A_USER_WITH_THE_SAME_EMAIL, HttpStatus.BAD_REQUEST));
                                                } else {
                                                    return resolve(saveUser(user, userCognito));
                                                }
                                            })
                                            .catch(error => {
                                                return reject(error);
                                            });
                                    }

                                    if (user.userTypeId === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_USER) {
                                        listServiceCenters.forEach(serviceCenter => {
                                            if (!serviceCenter.isActive) {
                                                return reject(new businessError(I18NHelper.getBusinessErrorMessages().SERVICE_CENTER_INACTIVE, HttpStatus.BAD_REQUEST));
                                            } else {
                                                userCognito.SCNickname = serviceCenter.nickname;
                                                return resolve(saveUser(user, userCognito));
                                            }
                                        });
                                    }

                                }).catch(error => {
                                    return reject(error);
                                });
                        }
                    } else {
                        userDao.getByEmail(user.email)
                            .then(users => {
                                if (users.length > 0) {
                                    return reject(new businessError(I18NHelper.getBusinessErrorMessages().THERE_IS_ALREADY_A_USER_WITH_THE_SAME_EMAIL, HttpStatus.BAD_REQUEST));
                                } else {
                                    user.serviceCenterIds = [];
                                    return resolve(saveUser(user, userCognito));
                                }
                            })
                            .catch(error => {
                                return reject(error);
                            });
                    }
                })
                .catch(error => {
                    return reject(new businessError(I18NHelper.getBusinessErrorMessages().USER_TYPE_INVALID, HttpStatus.BAD_REQUEST));
                });
        });
    },

    updateUser(login, user, loggedUser) {
        return new Promise((resolve, reject) => {
            userDao.getByLogin(login).then(userOld => {
                if (!validatePermissions(userOld, loggedUser, false)) {
                    return reject(new businessError('', HttpStatus.BAD_REQUEST));
                }
                // Validates if the user is allowed to change the email.
                if (!validateUpdateEmailPermission(user, userOld, loggedUser)) {
                    return reject(new businessError('', HttpStatus.BAD_REQUEST));
                }
                // Validates the user e-mail when the user is master, Samsung or SC admin.
                if ((userOld.UserType.id === userTypeDefinitions.USER_TYPE_MASTER_ADMIN ||
                    userOld.UserType.id === userTypeDefinitions.USER_TYPE_SAMSUNG_ADMIN ||
                    userOld.UserType.id === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_ADMIN) &&
                    userOld.email !== user.email) {

                    userDao.getByEmail(user.email)
                        .then(users => {
                            if (users.length > 0) {
                                return reject(new businessError(I18NHelper.getBusinessErrorMessages().THERE_IS_ALREADY_A_USER_WITH_THE_SAME_EMAIL, HttpStatus.BAD_REQUEST));
                            } else {
                                return resolve(updateUser(login, user, userOld));
                            }
                        }).catch(error => {
                            return reject(error);
                        });
                } else {
                    return resolve(updateUser(login, user, userOld));
                }
            }).catch((error) => {
                if (error) {
                    return reject(error);
                } else {
                    return reject(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_FIND_CURRENT_USER, HttpStatus.NOT_FOUND));
                }
            });
        });
    },

    getByLogin(login, loggedUser) {
        return new Promise((resolve, reject) => {
            login = login.toLowerCase();
            userDao.getByLogin(login).then(user => {
                if (loggedUser && !validatePermissions(user, loggedUser, false)) {
                    return reject(new businessError('', HttpStatus.BAD_REQUEST));
                }
                return resolve(user);
            }).catch((error) => {
                if (error) {
                    return reject(error);
                } else {
                    return reject(new businessError(I18NHelper.getBusinessErrorMessages().USER_DOES_NOT_EXIST, HttpStatus.NOT_FOUND));
                }
            });
        });
    },

    findUsersByServiceCenterId(serviceCenterId) {
        let result = {
            serviceCenter: {},
            users: {}
        };
        return new Promise((resolve, reject) => {
            serviceCenterBo.getById(serviceCenterId)
                .then((serviceCenter => {
                    userDao.findUsersByServiceCenterId(serviceCenterId).then(users => {
                        result.serviceCenter = serviceCenter;
                        result.users = users;

                        return resolve(result);
                    }).catch((error) => {
                        if (error) {
                            return reject(error);
                        } else {
                            return reject(new businessError(I18NHelper.getBusinessErrorMessages().USER_DOES_NOT_EXIST, HttpStatus.NOT_FOUND));
                        }
                    });
                }))
                .catch(error => {
                    reject(error);
                });
        });
    },
    changeUserStatus(login, status, loggedUser) {
        return new Promise((resolve, reject) => {
            let oldUserStatus = {};
            let isActive;

            try {
                isActive = utils.getBool(status);
            }
            catch (error) {
                return reject(new businessError(I18NHelper.getBusinessErrorMessages().INVALID_INPUT, HttpStatus.BAD_REQUEST));
            }

            userDao.getByLogin(login).then(user => {
                oldUserStatus = user.isActive;
                if (!validatePermissions(user, loggedUser, true)) {
                    return reject(new businessError('', HttpStatus.BAD_REQUEST));
                }
                // Validate if this user can be inative
                if (user.UserType.id === userTypeDefinitions.USER_TYPE_MASTER_ADMIN
                    || user.UserType.id === userTypeDefinitions.USER_TYPE_SAMSUNG_ADMIN
                    || user.UserType.id === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_ADMIN) {
                    return reject(new businessError(I18NHelper.getBusinessErrorMessages().USER_TYPE_INVALID, HttpStatus.BAD_REQUEST));
                }

                // Validate users activation from an inactive Service Center.
                if (isActive && user.UserType.id === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_USER) {

                    serviceCenterBo.getServiceCenterByListId(getServiceCentersIdsInUser(user))
                        .then((listServiceCenters) => {
                            listServiceCenters.forEach(serviceCenter => {
                                if (!serviceCenter.isActive) {
                                    return reject(new businessError(I18NHelper.getBusinessErrorMessages().SERVICE_CENTER_INACTIVE, HttpStatus.BAD_REQUEST));
                                } else {
                                    return resolve(updateStatusUser(login, isActive, oldUserStatus));
                                }
                            });
                        }).catch(error => {
                            return reject(error);
                        });
                } else {
                    return resolve(updateStatusUser(login, isActive, oldUserStatus));
                }
            }).catch((error) => {
                if (error) {
                    return reject(error);
                } else {
                    return reject(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_FIND_CURRENT_USER, HttpStatus.NOT_FOUND));
                }
            });
        });
    },

    getAllUserTypes() {
        return new Promise((resolve, reject) => {
            return resolve(userDao.getAllUserTypes());
        });
    },

    getUserTypeById(userTypeId) {
        return new Promise((resolve, reject) => {
            userDao.getUserTypeById(userTypeId).then((userType) => {
                resolve(userType);
            }).catch((error) => {
                return reject(new businessError(I18NHelper.getBusinessErrorMessages().USER_TYPE_NOT_FOUND, HttpStatus.NOT_FOUND));
            });
        });
    },
    getActiveUsersBySCIdAndUserType(serviceCenterId, userTypeId) {
        return new Promise((resolve, reject) => {
            userDao.getActiveUsersBySCIdAndUserType(serviceCenterId, userTypeId).then((users) => {
                resolve(users);
            }).catch((error) => {
                return reject(new businessError(I18NHelper.getBusinessErrorMessages().USER_NOT_FOUND, HttpStatus.NOT_FOUND));
            });
        });
    },

    hasServicePermission(login, serviceUuid) {
        return new Promise((resolve, reject) => {
            userDao.hasServicePermission(login, serviceUuid).then((hasPermission) => {
                resolve({ hasServicePermission: hasPermission });
            }).catch((error) => {
                return reject(new businessError(I18NHelper.getBusinessErrorMessages().ERROR_FIND_CURRENT_USER, HttpStatus.NOT_FOUND));
            });
        });
    }
};
module.exports = userBo;

function validatePermissions(user, loggedUser, isChangeStatus) {
    if ((user.id && user.id !== 0) || isChangeStatus) {
        user.userTypeId = user.UserType.id;
        if (user.ServiceCenters) {
            user.serviceCenterIds = user.ServiceCenters.map(serviceCenter => serviceCenter.id);
        }
    }

    if (loggedUser.UserType.id === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_ADMIN) {
        if (user.userTypeId === userTypeDefinitions.USER_TYPE_SAMSUNG_ADMIN || user.userTypeId === userTypeDefinitions.USER_TYPE_MASTER_ADMIN) {
            return false;
        } else if (user.userTypeId === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_ADMIN) {
            if (user.id !== loggedUser.id) {
                return false;
            }
        } else if (user.userTypeId === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_USER) {
            let serviceCenter = loggedUser.ServiceCenters.find(sc => sc.id === user.serviceCenterIds[0]); // The index zero is valid because users can only have one SC associated.
            if (!serviceCenter) {
                return false;
            }
        }
    } else if (loggedUser.UserType.id === userTypeDefinitions.USER_TYPE_SAMSUNG_ADMIN) {
        if (user.userTypeId === userTypeDefinitions.USER_TYPE_MASTER_ADMIN) {
            return false;
        }
    } else if (loggedUser.UserType.id === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_USER) {
        if (user.id !== loggedUser.id) {
            return false;
        }
    }
    return true;
}

function saveUser(user, userCognito) {
    return new Promise((resolve, reject) => {
        user.isActive = true;
        userDao.create(user)
            .then(createdUser => {
                authService.createUser(userCognito)
                    .then(createdCognitoUser => {
                        return resolve(createdUser);
                    }).catch(error => {
                        userDao.delete(user.login).then(() => {
                            if (cognitoMessages.COGNITO_ERROR_USER_EXIST === error) {
                                return reject(new businessError(I18NHelper.getBusinessErrorMessages().THERE_IS_ALREADY_A_USER_WITH_THE_SAME_LOGIN, HttpStatus.BAD_REQUEST));
                            }
                            return reject(error);
                        }).catch(err => {
                            return reject(err);
                        });
                    });
            }).catch((error) => {
                if (error.name === constants.SEQUELIZE_UNIQUE_CONSTRAINT_ERROR) {
                    let fields = error.errors.map(dt => dt.path);
                    fields.forEach(function (field, index) {
                        if (field === userDefinitions.LOGIN_COLUMN) {
                            return reject(new businessError(
                                format(I18NHelper.getBusinessErrorMessages().THERE_IS_ALREADY_A_USER_WITH_THE_SAME_LOGIN, user.login), HttpStatus.BAD_REQUEST));
                        }
                    });
                }
                return reject(error);
            });
    });
}

function updateStatusUser(login, isActive, oldUserStatus) {
    return new Promise((resolve, reject) => {
        let userCognitoToBeChanged = {};

        userCognitoToBeChanged.login = login;
        userCognitoToBeChanged.isActive = isActive;

        userDao.updateStatus(login.toLowerCase(), isActive)
            .then(() => {
                authService.changeUserStatus(userCognitoToBeChanged)
                    .then(() => {
                        return resolve();
                    }).catch(error => {
                        userDao.updateStatus(login.toLowerCase(), oldUserStatus)
                            .then(() => {
                                return reject(error);
                            }).catch((error) => {
                                return reject(error);
                            });
                    });
            }).catch((error) => {
                return reject(error);
            });
    });
}

function getServiceCentersIdsInUser(user) {
    let listServiceCentersIds = new Array();

    if (user.ServiceCenters && user.ServiceCenters.length > 0) {
        user.ServiceCenters.forEach(serviceCenter => {
            listServiceCentersIds.push(serviceCenter.id);
        });
    }
    return listServiceCentersIds;
}

function validateUpdateEmailPermission(user, userOld, loggedUser) {
    if (user.email !== userOld.email && userOld.id !== loggedUser.id) {
        return false;
    }
    return true;
}

function updateUser(login, user, userOld) {
    return new Promise((resolve, reject) => {
        userDao.update(login.toLowerCase(), user)
            .then(updatedUser => {
                authService.updateUser(login.toLowerCase(), user)
                    .then(updatedUserCognito => {
                        return resolve(updatedUser);
                    }).catch(error => {
                        userDao.update(login.toLowerCase(), userOld)
                            .then(updatedUser => {
                                return reject(error);
                            }).catch((error) => {

                                return reject(error);
                            });
                    });
            }).catch((error) => {
                return reject(error);
            });
    });
}