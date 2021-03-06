// const { S3 } = require('@aws-sdk/client-s3');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require("fs");

// const s3 = new S3({ region: 'eu-west-1' });
const s3 = new AWS.S3({ region: 'eu-west-1' });

const fileStorage = multerS3({
    s3,
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: "inline",
    bucket: process.env.AWS_S3_BUCKET,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, callback) => {
        const fileName = "new/" + new Date().getTime() + "-" + file.originalname;
        callback(null, fileName);
    }
});

const handleImage = multer({ storage: fileStorage }).single("image");

const getImage = async (req, res, next) => {
    const key = req.query.key;
    // console.log(key);

    try {
        const { Body } = await s3.getObject({
            Key: key,
            Bucket: process.env.AWS_S3_BUCKET
        }).promise();

        // fs.writeFileSync("./images/image.jpg", Body);
        req.imageBuffer = Body;
        next();
    } catch (err) {
        console.log(err);
        res.status(404).send({ message: "file not found" });
    }
};

const deleteImage = async (req, res, next) => {
    const key = req.body.key;
    try {
        await s3.deleteObject({
            Key: key,
            Bucket: process.env.AWS_S3_BUCKET
        }).promise();
        next();
    } catch (err) {
        console.log(err);
        res.status(404).send({ message: "file not found" });
    }
};

module.exports = { handleImage, getImage, deleteImage };