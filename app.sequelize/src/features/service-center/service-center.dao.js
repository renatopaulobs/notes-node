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
const serviceCenterS3Dao = require('../../utils/s3-utils.js');
const databaseDefinitions = require('../../../database/config/database.definitions');

function getILikeCondition(field, param) {
    return db.sequelize.condition(db.sequelize.fn(databaseDefinitions.EXTENSION_UNACCENT, db.sequelize.col(field)), { $iLike: db.sequelize.fn(databaseDefinitions.EXTENSION_UNACCENT, constants.PERCENT + param + constants.PERCENT) });
}

const serviceCenterDao =
{
    create(serviceCenter, signatureImage) {
        return new Promise((resolve, reject) => {
            serviceCenterS3Dao.upload(signatureImage, process.env.AWS_S3_SIGNATURE_BUCKET_NAME).then(imageName => {
                serviceCenter.ownerSignatureFileName = imageName;
                db.ServiceCenter
                    .create(serviceCenter).then((serviceCenter) => {
                        return resolve(serviceCenter);
                    }).catch((err) => {
                        reject(err);
                    });
            }).catch((err) => {
                reject(err);
            });
        });
    },
    update(serviceCenterId, updateServiceCenter, signatureImage) {
        return new Promise((resolve, reject) => {
            serviceCenterS3Dao.upload(signatureImage, process.env.AWS_S3_SIGNATURE_BUCKET_NAME).then(imageName => {
                if (typeof (imageName) !== constants.UNDEFINED && imageName !== null) {
                    updateServiceCenter.ownerSignatureFileName = imageName;
                }
                db.ServiceCenter
                    .update(updateServiceCenter,
                        {
                            returning: true,
                            where:
                            {
                                id: serviceCenterId
                            }
                        })
                    .then((serviceCenter) => {
                        resolve(serviceCenter);
                    }).catch((err) => {
                        reject(err);
                    });
            }).catch((err) => {
                reject(err);
            });
        });
    },
    updateStatus(serviceCenterId, status) {
        return new Promise((resolve, reject) => {
            return db.ServiceCenter
                .update(
                    { isActive: status },
                    { returning: true, where: { id: serviceCenterId } }
                ).then((serviceCenter) => {
                    return resolve(serviceCenter);
                }).catch((error) => {
                    return reject(error);
                });
        });
    },
    getById(serviceCenterId) {
        return new Promise((resolve, reject) => {
            return db.ServiceCenter
                .findById(serviceCenterId, {
                    include: [{
                        model: db.ServiceCenterType
                    },
                    {
                        model: db.Service,
                        through: { attributes: [] }
                    }
                    ],
                    attributes: { exclude: ['sysPeriod', 'serviceCenterTypeId'] }
                }).then((serviceCenter) => {
                    if (serviceCenter) {
                        return resolve(serviceCenter);
                    } else {
                        return reject();
                    }
                }).catch((err) => {
                    reject(err);
                });
        });
    },
    getAll(params) {
        let page = 1;
        let limit = Number.MAX_SAFE_INTEGER;
        let paramNickname = params.nickname;
        let paramLocale = params.locale;
        let paramOnlyActive = params.onlyActive;
        const paramTypeId = params.typeId;
        const conditions = [];
        const whereQuery = {};
        const localizationQuery = {};
        let paramSCIds = params.SCIds;

        if (params._page) {
            page = params._page;
        }

        if (params._limit) {
            limit = params._limit;
        }

        if (paramNickname) {
            conditions.push(getILikeCondition('nickname', paramNickname));
        }

        if (paramLocale) {
            localizationQuery['$or'] =
                [
                    getILikeCondition('geolocalizationStateCode', paramLocale),
                    getILikeCondition('geolocalizationStateName', paramLocale),
                    getILikeCondition('geolocalizationCityName', paramLocale),
                    getILikeCondition('neighborhood', paramLocale),
                    getILikeCondition('address', paramLocale)
                ];
            conditions.push(localizationQuery);
        }

        if (paramTypeId) {
            conditions.push(db.sequelize.condition(db.sequelize.col('serviceCenterTypeId'), paramTypeId));
        }

        if (paramOnlyActive) {
            conditions.push(db.sequelize.condition(db.sequelize.col('isActive'), paramOnlyActive));
        }

        if (paramSCIds) {
            conditions.push({ id: { $in: paramSCIds } });
        }

        whereQuery['$and'] = conditions;

        return db.ServiceCenter
            .findAndCountAll({
                include: [{
                    model: db.ServiceCenterType
                },
                {
                    model: db.Service,
                    through: { attributes: [] }
                }
                ],
                attributes: { exclude: 'sysPeriod' },
                offset: (page - 1) * limit, // Because the first page shall not skip any row, we shall subtract 1 from the page
                limit: limit,
                where: whereQuery,
                distinct: true,
                order: ['nickname', 'id']
            });
    },
    getServiceCenterByNickname(serviceCenterNickname) {
        return new Promise((resolve, reject) => {
            db.ServiceCenter.findAll({
                attributes: ['id'],
                where: {
                    nickname: { $iLike: constants.PERCENT + serviceCenterNickname + constants.PERCENT }
                }
            }).then((serviceCenters) => {
                let data = serviceCenters.map(serviceCenter => serviceCenter.dataValues);
                return resolve(data);

            }).catch(error => {
                reject(error);
            });
        });
    },
    getServiceCenterByListId(serviceCenterIds) {
        return new Promise((resolve, reject) => {
            db.ServiceCenter.findAll({
                attributes: ['id', 'nickname', 'isActive'],
                where: {
                    id: { $in: serviceCenterIds }
                }
            }).then((serviceCenters) => {
                let data = serviceCenters.map(serviceCenter => serviceCenter.dataValues);
                return resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    },
    validateByCodeNameAndJuridicalDocument(serviceCenter, serviceCenterId) {
        return new Promise((resolve, reject) => {
            const params = [{ code: serviceCenter.code }];
            if (serviceCenter.juridicalPersonDocument) {
                params.push({ juridicalPersonDocument: serviceCenter.juridicalPersonDocument });
            }

            db.ServiceCenter.findAll({
                where: {
                    $or: params,
                    id: { $ne: serviceCenterId }
                }
            }
            ).then((serviceCenters) => {
                let data = serviceCenters.map(serviceCenter => serviceCenter.dataValues);
                if (data.length > 0) {
                    reject(data[0]);
                } else {
                    resolve();
                }
            });
        });
    },
    getAllServiceCenterTypes() {
        return db.ServiceCenterType.findAll({ attributes: { exclude: 'sysPeriod' } });
    },
    associateServices(associationLists) {
        return new Promise((resolve, reject) => {
            db.sequelize.transaction().then((t) => {
                const promises = associationLists.map(association => {
                    return db.ServiceCenter
                        .findById(association.id, { transaction: t })
                        .then(serviceCenter => {
                            return serviceCenter.addServices(association.addAssociation, { transaction: t })
                                .then(serviceCenter => {
                                    return db.ServiceCentersServices
                                        .destroy({
                                            where: {
                                                serviceCenterId: association.id,
                                                serviceId: { $in: association.deleteAssociation }
                                            }
                                        }, { transaction: t });
                                });
                        });
                });

                resolve(Promise.all(promises).then(() => {
                    t.commit();
                    return this.getAll({ onlyActive: true }).then((serviceCenters) => {
                        return serviceCenters.rows;
                    }); // Sending empty params so getAll wont paginate.
                }).catch((err) => t.rollback()));
            });
        });
    }
};

module.exports = serviceCenterDao;
