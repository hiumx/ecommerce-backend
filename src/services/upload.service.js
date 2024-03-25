'use strict';

const cloudinary = require('../configs/cloudinary.config');

class UploadService {

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
}

module.exports = UploadService;