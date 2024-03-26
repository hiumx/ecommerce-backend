'use strict';

const multer = require('multer');

const memoryStorage = multer({
    storage: multer.memoryStorage()
}); 

const diskStorage = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './src/uploads')
        },
        filename: function(req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
});

module.exports = {
    memoryStorage,
    diskStorage
}