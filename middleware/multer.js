// const { S3 } = require('@aws-sdk/client-s3');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// const s3 = new S3({ region: 'eu-west-1' });
const s3 = new AWS.S3({ region: 'eu-west-1' });

const fileStorage = multerS3({
    s3,
    acl: 'public-read',
    contentDisposition: "inline",
    bucket: process.env.AWS_S3_BUCKET,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, callback) => {
        const fileName = new Date().getTime() + "-" + file.originalname;
        callback(null, fileName);
    }
});

// const fileStorage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'images');
//     },
//     filename: (req, file, callback) => {
//         const fileName = new Date().getTime() + "-" + file.originalname;
//         callback(null, fileName);
//     }
// });

const handleImage = multer({ storage: fileStorage }).single("image");

module.exports = { handleImage };