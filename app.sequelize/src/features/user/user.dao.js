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

const db = require('../../sequelize.models.js');
const constants = require('../../utils/constants');
const databaseDefinitions = require('../../../database/config/database.definitions');
const userDefinitions = require('./user.definitions');
const serviceCenterDefinitions = require('../service-center/service-center.definitions');
const usersServiceCentersDefinitions = require('./users-service-centers.definitions');
const userTypeDefinitions = require('./user-type.definitions');

const userDao = {
    getUserTypeById(userTypeId) {
        return new Promise((resolve, reject) => {
            db.UserType.findById(userTypeId)
                .then((userType) => {
                    if (userType)
                        return resolve(userType);
                    else
                        return reject();
                }).catch((err) => {
                    return reject(err);
                });
        });
    },

    getAllUserTypes() {
        return db.UserType.findAll();
    },

    create(user) {
        return new Promise((resolve, reject) => {
            db.sequelize.transaction().then((t) => {
                return db.User.create(user, { transaction: t }).then((userCreated) => {

                    if (user.userTypeId === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_ADMIN ||
                        user.userTypeId === userTypeDefinitions.USER_TYPE_SERVICE_CENTER_USER) {

                        const promises = user.serviceCenterIds.map(serviceCenterId => {
                            return userCreated.addServiceCenter(serviceCenterId, { transaction: t })
                                .then(serviceCenter => {
                                    const conditions = [];
                                    const whereQuery = {};

                                    conditions.push(db.sequelize.condition(db.sequelize.col(usersServiceCentersDefinitions.USER_ID_COLUMN), userCreated.id));
                                    conditions.push(db.sequelize.condition(db.sequelize.col(usersServiceCentersDefinitions.SERVICE_CENTER_ID_COLUMN), serviceCenterId));

                                    whereQuery['$and'] = conditions;
                                }).catch((err) => {
                                    return reject(err);
                                });
                        });
                        return resolve(Promise.all(promises)
                            .then(() => {
                                t.commit();
                                return resolve(user);
                            }).catch((err) => {
                                t.rollback();
                                return reject(err);
                            })
                        );

                    } else {
                        t.commit();
                        return resolve(user);
                    }
                }).catch((err) => {
                    t.rollback();
                    return reject(err);
                });
            }).catch((error) => {
                return reject(error);
            });
        });
    },
    update(login, updateUser) {
        return new Promise((resolve, reject) => {
            db.User
                .update(updateUser,
                    {
                        fields: ['name', 'email'],
                        returning: true,
                        where: db.sequelize.condition(db.sequelize.col(userDefinitions.LOGIN_COLUMN), login)
                    })
                .then((user) => {
                    return resolve(user);
                }).catch((err) => {
                    return reject(err);
                });
        });
    },
    updateStatus(login, isActive) {
        return new Promise((resolve, reject) => {
            db.User
                .update(
                    { isActive: isActive },
                    { returning: true, where: db.sequelize.condition(db.sequelize.col(userDefinitions.LOGIN_COLUMN), login) }
                )
                .then(() => {
                    return resolve();
                }).catch((err) => {
                    return reject(err);
                });
        });
    },
    disableUsers(loginUsers) {
        return new Promise((resolve, reject) => {
            db.sequelize.transaction().then((t) => {
                db.User
                    .update(
                        { isActive: false },
                        { returning: true, where: db.sequelize.condition(db.sequelize.col(userDefinitions.LOGIN_COLUMN), { $in: loginUsers }) },
                        { transaction: t }
                    )
                    .then((users) => {
                        t.commit();
                        return resolve(users);
                    }).catch((err) => {
                        t.rollback();
                        return reject(err);
                    });
            }).catch((error) => {
                return reject(error);
            });
        });
    },
    enableUsers(loginUsers) {
        return new Promise((resolve, reject) => {
            db.sequelize.transaction().then((t) => {
                db.User
                    .update(
                        { isActive: true },
                        { returning: true, where: db.sequelize.condition(db.sequelize.col(userDefinitions.LOGIN_COLUMN), { $in: loginUsers }) },
                        { transaction: t }
                    )
                    .then((users) => {
                        t.commit();
                        return resolve(users);
                    }).catch((err) => {
                        t.rollback();
                        return reject(err);
                    });
            }).catch((error) => {
                return reject(error);
            });
        });
    },
    delete(login) {
        return new Promise((resolve, reject) => {
            this.getByLogin(login).then(user => {
                db.sequelize.transaction().then((t) => {

                    let deleteUsersSCPromise = db.UsersServiceCenters.destroy(
                        { where: { userId: user.id } }, { transaction: t }
                    );

                    let deleteUserPromise = db.User.destroy(
                        { where: { id: user.id } }, { transaction: t }
                    );

                    Promise.all([deleteUsersSCPromise, deleteUserPromise])
                        .then(() => {
                            t.commit();
                            return resolve();
                        }).catch((err) => {
                            t.rollback();
                            return reject(err);
                        });

                }).catch((error) => {
                    return reject(error);
                });
            }).catch((error) => {
                return reject(error);
            });
        });
    },
    getByLogin(loginParam) {
        return new Promise((resolve, reject) => {
            return db.User.findAll({
                include: [
                    { model: db.UserType },
                    {
                        model: db.ServiceCenter,
                        required: false,
                        include: [
                            { model: db.ServiceCenterType },
                            { model: db.Service }
                        ]
                    }
                ],
                attributes: { exclude: ['sysPeriod', 'countryCode', 'userTypeId'] },
                where: db.sequelize.condition(db.sequelize.col(userDefinitions.LOGIN_FILTER_COLUMN), loginParam)
            }).then((users) => {
                if (users.length > 0) {
                    return resolve(users[0]);
                } else {
                    reject();
                }
            }).catch(error => {
                reject(error);
            });
        });
    },

    getByEmail(emailParam) {
        return new Promise((resolve, reject) => {
            return db.User.findAll({
                attributes: ['id', 'login'],
                where: db.sequelize.condition(db.sequelize.col(userDefinitions.EMAIL_COLUMN), emailParam)
            }).then((users) => {
                return resolve(users);
            }).catch(error => {
                reject(error);
            });
        });
    },

    getAll(params) {
        let page = 1;
        let limit = Number.MAX_SAFE_INTEGER;
        let paramServiceCenterNickname = params.serviceCenterNickname;
        let paramName = params.name;
        let paramLogin = params.login;
        let paramUserTypeId = params.userType;
        let paramAssociatedUsersIds = params.usersIds;
        let isRequired = false;

        const conditions = [];
        const whereQuery = {};
        let whereQueryServiceCenter = {};
        let whereQueryUserType = {};

        if (params._page) {
            page = params._page;
        }

        if (params._limit) {
            limit = params._limit;
        }

        if (paramServiceCenterNickname) {
            whereQueryServiceCenter = getILikeCondition(serviceCenterDefinitions.NICKNAME_FILTER_COLUMN, paramServiceCenterNickname);
            isRequired = true;
        }

        if (paramName) {
            conditions.push(getILikeCondition(userDefinitions.NAME_FILTER_COLUMN, paramName));
        }

        if (paramLogin) {
            conditions.push(getILikeCondition(userDefinitions.LOGIN_COLUMN, paramLogin));
        }

        if (paramUserTypeId) {
            whereQueryUserType = db.sequelize.condition(db.sequelize.col(userTypeDefinitions.USER_TYPE_ID_FILTER_COLUMN), { $in: paramUserTypeId });
        }

        if (paramAssociatedUsersIds) {
            conditions.push({ id: { $in: paramAssociatedUsersIds } });
        }

        whereQuery['$and'] = conditions;

        return db.User.findAndCountAll({
            include: [
                {
                    model: db.UserType,
                    where: whereQueryUserType,
                    required: true
                },
                {
                    model: db.ServiceCenter,
                    where: whereQueryServiceCenter,
                    required: isRequired,
                    include: [
                        { model: db.ServiceCenterType },
                        { model: db.Service }
                    ]

                }
            ],
            attributes: { exclude: ['id', 'sysPeriod', 'countryCode', 'userTypeId'] },
            offset: (page - 1) * limit, // Because the first page shall not skip any row, we shall subtract 1 from the page
            limit: limit,
            where: whereQuery,
            distinct: true,
            order: ['name', 'id']
        });
    },

    findUsersByServiceCenterId(serviceCenterId) {
        return new Promise((resolve, reject) => {
            return db.User.findAll({
                include: [
                    {
                        model: db.UserType
                    },
                    {
                        model: db.ServiceCenter,
                        attributes: [],
                        where: {
                            id: serviceCenterId
                        },
                        include: [
                            { model: db.ServiceCenterType, attributes: [] },
                            { model: db.Service, attributes: [] }
                        ]
                    }
                ],
                attributes: { exclude: ['id', 'sysPeriod', 'countryCode', 'userTypeId'] }
            }).then((users) => {
                if (users.length > 0) {
                    return resolve(users);
                } else {
                    reject();
                }
            }).catch(error => {
                reject(error);
            });
        });
    },

    getActiveUsersBySCIdAndUserType(serviceCenterId, userTypeId) {
        return new Promise((resolve, reject) => {
            return db.User.findAll({
                include: [
                    {
                        model: db.UserType,
                        attributes: [],
                        where: {
                            id: userTypeId
                        }

                    },
                    {
                        model: db.ServiceCenter,
                        attributes: [],
                        where: {
                            id: serviceCenterId
                        }
                    }
                ],
                attributes: { include: ['login', 'userTypeId'] },
                where: { isActive: true }
            }).then((users) => {
                return resolve(users);
            }).catch(error => {
                reject(error);
            });
        });
    },

    hasServicePermission(login, serviceUuid) {
        return new Promise((resolve, reject) => {
            db.User.findAll({
                attributes: ['id', 'userTypeId'],
                where: {
                    login: login
                },
                include: [
                    {
                        model: db.ServiceCenter,
                        attributes: ['id'],
                        through: {
                            attributes: []
                        },
                        include: [
                            {
                                model: db.Service,
                                attributes: ['id'],
                                where: {
                                    uuId: serviceUuid
                                },
                                through: {
                                    attributes: []
                                }
                            }
                        ]
                    }
                ]
            }).then((users) => {
                if (users) {
                    return resolve(users[0].ServiceCenters.length > 0 ||
                                   users[0].userTypeId == userTypeDefinitions.USER_TYPE_MASTER_ADMIN ||
                                   users[0].userTypeId == userTypeDefinitions.USER_TYPE_SAMSUNG_ADMIN);
                }
                else {
                    return resolve(false);
                }
            }).catch((err) => {
                return reject(err);
            });
        });
    },
    getAssociatedUsers(serviceCentersIds) {
        return db.UsersServiceCenters.findAll({
            attributes: ['userId'],
            where: {
                serviceCenterId: { $in: serviceCentersIds }
            }
        });
    }
};

function getILikeCondition(field, param) {
    return db.sequelize.condition(db.sequelize.fn(databaseDefinitions.EXTENSION_UNACCENT, db.sequelize.col(field)),
        {
            $iLike: db.sequelize.fn(databaseDefinitions.EXTENSION_UNACCENT, constants.PERCENT + param + constants.PERCENT)
        });
}
module.exports = userDao;