const multer = require('multer');
const AWS = require('aws-sdk');

const s3 = new AWS.S3

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const fileName = new Date().getTime() + "-" + file.originalname;
        callback(null, fileName);
    }
});

const handleImage = multer({ storage: fileStorage }).single("image");

module.exports = { handleImage };