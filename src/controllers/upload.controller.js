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

    async uploadImageFromLocal(req, res, next) {
        const { file } = req;
        new SuccessResponse({
            message: 'Upload image from local success',
            metadata: await UploadService.uploadImageFromLocal({
                path: file.path
            })
        }).send(res);
    }

    async uploadImagesFromLocal(req, res, next) {
        const { files } = req;
        new SuccessResponse({
            message: 'Upload images from local success',
            metadata: await UploadService.uploadImagesFromLocal({
                paths: files.map(file => file.path)
            })
        }).send(res);
    }
}

module.exports = new UploadController();