'use strict';

const cloudinary = require('../configs/cloudinary.config');
const { PutObjectCommand, clientS3 } = require('../configs/s3.config');
const crypto = require('node:crypto');

class UploadService {

    //// Upload with S3

    static async uploadImageFromLocalS3(file) {
        try {
            const randomImageName = () => crypto.randomBytes(16).toString('hex');

            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: randomImageName(),
                Body: file.buffer,
                ContentType: 'image/jpeg'
            });

            const response = await clientS3.send(command);
            return response;
        } catch (error) {
            console.log('Error upload image with S3', error);
        }

    }

    //// End upload with s3

    // 1. Upload image from url
    static async uploadImageFromUrl() {
        try {
            const imageUrl = 'https://down-vn.img.susercontent.com/file/sg-11134201-7qve6-lk9y9vkzqoay01';
            const folder = 'shopDev/shopId', newFileName = 'test-name2-image';

            const result = await cloudinary.uploader.upload(imageUrl, {
                public_id: newFileName,
                folder
            });

            console.log(result);
            return result;
        } catch (error) {
            console.error(`Error upload image `, error);
        }
    }

    // 2. Upload image from local
    static async uploadImageFromLocal({ path, folder = 'shopDev/2501' }) {
        try {
            const newFileName = 'thumb';
            const result = await cloudinary.uploader.upload(path, {
                public_id: newFileName,
                folder
            });

            console.log(result);

            return {
                'image_url': result.secure_url,
                'shopId': 2501,
                'thumb-url': await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: 'jpg'
                })
            }
        } catch (error) {
            console.error(`Error upload image `, error);
        }
    }

    // 3. Upload multiple images from local
    static async uploadImagesFromLocal({ paths = [], folder = 'shopDev/2501' }) {
        try {
            let result, newFileName;
            const results = [];
            for (let i = 0; i < paths.length; i++) {
                newFileName = `thumb-${i}`;
                result = await cloudinary.uploader.upload(paths[i], {
                    public_id: newFileName,
                    folder
                });
                results.push(result);
                console.log(result);
            }
            return results;
        } catch (error) {
            console.error('Error upload multiple images ', error);
        }
    }
}

module.exports = UploadService;