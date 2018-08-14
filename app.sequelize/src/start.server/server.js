/*
* Copyright (c) 2018 Samsung Electronics Co., Ltd. , (c) Center of Informatics
* Federal University of Pernambuco.
* All rights reserved.
*
* This software is a confidential and proprietary information of Samsung
* Electronics, Inc. ('Confidential Information'). You shall not disclose such
* Confidential Information and shall use it only in accordance with the terms
* of the license agreement you entered into with Samsung Electronics.
*/

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const errorhandler = require('strong-error-handler');
const appRoutes = require('./app.routes');
const expressValidation = require('express-validator');
const HttpStatus = require('http-status-codes');
const constants = require('../utils/constants');
const morganLogger = require('morgan');
const logger = require('../utils/logger');
const locale = require('locale');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const trim = require('deep-trim-node');
const I18NHelper = require('../utils/locale/I18N.helper');
const cookieParser = require('cookie-parser');
const util = require('util');

// SWAGGER configuration
if (constants.ENABLE_SWAGGER) {
    const expressSwagger = require('express-swagger-generator')(app);
    let options = {
        swaggerDefinition: {
            info: {
                description: 'LS ASC Directory Microservice API',
                title: 'LS ASC Directory Microservice API',
                version: '1.0.0'
            },
            host: constants.HOST + ':' + process.env.SERVER_PORT,
            produces: [
                'application/json'
            ],
            schemes: ['http', 'https']
        },
        basedir: __dirname, // app absolute path

        files: ['../features/**/*.js'] // Path to the API handle folder
    };
    expressSwagger(options);
}

// Security Settings
// https://www.npmjs.com/package/helmet#how-it-works
// By default, helmet disables DNS prefetching, protects against frame-based attacks (like clickjacking)
// removes the X-Powered-By header (blocking people from knowing which server version is running), forces
// using HTTPS, disables browser's mime type sniffing and adds very basic protection against XSS.
app.use(helmet());
// Enabled to comply with FR_10.0 1 Back after logout
app.use(helmet.noCache());
app.use(helmet.hsts({
    setIf: (req, res) => constants.ENABLE_FORCE_HTTPS
}));
// Consider using helmet.hpkp() [JIRA: LSTRS-19]
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ['\'self\''],
        // The amazonaws.com domain must be changed when we have our S3 buckets configured, to
        // restrict only to content in the specific bucket. [JIRA: LSTRS-20]
        imgSrc: ['\'self\'', '\'amazonaws.com\'']
    }
}));

app.use(compression());
app.use(locale(I18NHelper.supportedLanguages, I18NHelper.defaultLanguage));
app.use(expressValidation());

app.use(express.static(__dirname + '/../client/app'));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.json(
    {
        type: 'application/vnd.api+json'
    }));
app.use(methodOverride('X-HTTP-Method-Override'));

app.use((req, res, next) => {

    var responseSettings = {
        'AccessControlAllowOrigin': req.headers.origin,
        'AccessControlAllowHeaders': 'Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name',
        'AccessControlAllowMethods': 'POST, GET, PUT, DELETE, OPTIONS',
        'AccessControlAllowCredentials': true
    };


    res.header('Access-Control-Allow-Credentials', responseSettings.AccessControlAllowCredentials);
    res.header('Access-Control-Allow-Origin', responseSettings.AccessControlAllowOrigin);
    res.header('Access-Control-Allow-Headers', (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : 'x-requested-with');
    res.header('Access-Control-Allow-Methods', (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);
    res.header('Access-Control-Expose-Headers', 'X-Total-Count');

    if ('OPTIONS' === req.method) {
        res.send(HttpStatus.OK);
    }
    else {
        next();
    }
});

// Log requests to the console.
app.use(morganLogger(constants.TYPE_LOG_DEV));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
    {
        extended: false
    }));

logger.debug('Overriding \'Express\' logger');
app.use(require('morgan')({ 'stream': logger.stream }));

// Cookie Parser
app.use(cookieParser());

// Body logger
app.use((req, res, next) => {
    if (req.body) {
        logger.debug('\n******************\n'
                            + 'Log Path: '
                            + JSON.stringify(req.path)
                            + '\nLog Body: '
                            + JSON.stringify(req.body)
                            + '\nLog Query: '
                            + JSON.stringify(req.query)
                            + '\nLog Params: '
                            + JSON.stringify(req.params)
                            + '\n******************\n');
    }
    next();
});

// Trim handling
app.use((req, res, next) => {
    if (req.body) {
        req.body = trim(req.body);
    }
    next();
});

app.use((req, res, next) => {
    I18NHelper.setRequestLanguage(req);
    next();
});


// Application routes
appRoutes(app);

app.use((err, req, res, next) => {
    let nodeEnv = process.env.NODE_ENV;
    logger.debug(util.inspect(err));
    if (err.isJoi) {
        if (nodeEnv === constants.PRODUCTION){
            res.status(HttpStatus.BAD_REQUEST).send();
        } else {
            res.status(HttpStatus.BAD_REQUEST).json({
                errors: err.details.map(dt => dt.message)
            });
        }
    }
    else if (err.IsBusinessError) {
        res.status(err.status).json({
            errors: [err.message]
        });
    }
    else if (err instanceof SyntaxError && err.status === HttpStatus.BAD_REQUEST && constants.BODY in err && err.type === constants.ERROR_TYPE_PARSE) {
        logger.error(util.inspect(err));
        res.status(err.status).send();
    }
    else if (err instanceof URIError){
        logger.error(util.inspect(err));
        res.status(HttpStatus.BAD_REQUEST).json({
            errors: [ I18NHelper.getBusinessErrorMessages().INVALID_INPUT ]
        });
    }
    else {
        logger.error(util.inspect(err));
        next(err);
    }

});

app.use((err, req, res, next) => {
    if (err) {
        logger.error(util.inspect(err));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
        {
            message: 'INTERNAL SERVER ERROR'
        });
    return next(err);
});

module.exports = app;