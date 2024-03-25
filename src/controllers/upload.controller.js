'use strict';

const { SuccessResponse } = require('../core/success.response');
const UploadService = require('../services/upload.service');

class UploadController {
    async uploadImageFromUrl(req, res, next) {
        new SuccessResponse({
            message: 'Upload image from url success',
            metadata: await UploadService.uploadImageFromUrl()
        }).send(res);
    }
}

module.exports = new UploadController();