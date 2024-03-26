'use strict';

const { BadRequestError } = require('../core/error.response');
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
        if(!file) throw new BadRequestError('File missing');
        new SuccessResponse({
            message: 'Upload image from local success',
            metadata: await UploadService.uploadImageFromLocal({
                path: file.path
            })
        }).send(res);
    }

    async uploadImagesFromLocal(req, res, next) {
        const { files } = req;
        if(!files.length) throw new BadRequestError('Files missing');
        new SuccessResponse({
            message: 'Upload images from local success',
            metadata: await UploadService.uploadImagesFromLocal({
                paths: files.map(file => file.path)
            })
        }).send(res);
    }

    // upload with s3
    async uploadImagesFromLocalS3(req, res, next) {
        const { file } = req;
        if(!file) throw new BadRequestError('Files missing');
        new SuccessResponse({
            message: 'Upload images from local with S3 success',
            metadata: await UploadService.uploadImageFromLocalS3(file)
        }).send(res);
    }

}

module.exports = new UploadController();