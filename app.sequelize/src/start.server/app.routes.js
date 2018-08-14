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

const serviceCenterRoutes = require('../features/service-center/service-center.route.js');
const serviceRoutes = require('../features/service/service.route.js');
const userRoutes = require('../features/user/user.route');
module.exports = (app) => {
    serviceRoutes(app);
    serviceCenterRoutes(app);
    userRoutes(app);
};

