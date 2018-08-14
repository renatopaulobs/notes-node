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

const http = require('http');
const app = require('./server.js');
const radix = 10;
const port = parseInt(process.env.SERVER_PORT, radix);
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
