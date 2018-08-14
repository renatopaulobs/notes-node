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

const BASE64_TYPE='base64';
const FILE_EXTENSION='.png';
const BASE64_IMAGE_HEADER=/^data:image\/png;base64,/;

require('dotenv').config();
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const constants = require('./constants');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION
});

const s3Utils =
{
    upload(base64Image, bucket) {
        return new Promise((resolve, reject) => {
            let imageName = constants.EMPTY_STRING;

            if (!base64Image)
            {
                return resolve(base64Image);
            }

            const s3 = new AWS.S3({
                apiVersion: process.env.AWS_S3_API_VERSION,
                params: { Bucket: bucket },
                signatureVersion: process.env.AWS_S3_SIGNATURE_VERSION
            });

            const base64Data = base64Image.replace(BASE64_IMAGE_HEADER, '');
            const buffer = Buffer.from(base64Data, BASE64_TYPE);
            imageName = uuidv4() + FILE_EXTENSION;
            s3.upload({
                Key: imageName,
                Body: buffer,
                ACL: 'public-read'
            }, function (err, data) {
                if (err) {
                    return reject(err.message);
                }
                return resolve(imageName);
            });
        });
    },
    get(fileKey) {
        return new Promise((resolve, reject) => {
            if (fileKey === constants.EMPTY_STRING)
            {
                return resolve(fileKey);
            }
            const s3 = new AWS.S3({
                apiVersion: process.env.AWS_S3_API_VERSION,
                params: { Bucket: process.env.AWS_S3_SIGNATURE_BUCKET_NAME },
                signatureVersion: process.env.AWS_S3_SIGNATURE_VERSION
            });

            s3.getObject({ Key: fileKey }, function (err, data) {
                if (err) {
                    return reject(err.message);
                }
                if (data) {
                    return resolve(Buffer.from(data.Body).toString(BASE64_TYPE));
                } else {
                    return resolve();
                }
            });
        });
    }
};

module.exports = s3Utils;