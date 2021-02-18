const express = require('express');
const { Readable } = require('stream');
const { handleImage, getImage, deleteImage } = require('../middleware/s3-files');
// const { sendImage } = require("../middleware/s3-proxy");
const Image = require('../models/imageModel');

const router = new express.Router();

router.post("/upload-image", handleImage, async (req, res) => {
    console.log(req.file);
    if (!req.file) res.status(422).send({
        code: 422,
        message: "file not found"
    });
    const image = new Image({
        originalName: req.file.originalname,
        storageName: req.file.key.split("/")[1],
        bucket: process.env.AWS_S3_BUCKET,
        region: 'eu-west-1',
        location: req.file.key
    });

    try {
        await image.save();

        res.send(image);
    } catch (err) {
        console.log(err);
    }
});

router.get("/images", async (req, res) => {
    try {
        const images = await Image.find({});
        if (!images) {
            res.send([]);
        }
        res.send(images);
    } catch (err) {
        console.log(err);
    }
});

router.get("/get-image", getImage, (req, res) => {
    const stream = Readable.from(req.imageBuffer);
    const imageName = req.query.name;
    // res.setHeader('Content-Type', "image/jpeg");
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + imageName //inline
    );
    stream.pipe(res);
});

router.delete("/delete-image", deleteImage, async (req, res) => {

    try {
        await Image.findByIdAndDelete(req.body._id);
        res.send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

module.exports = router;