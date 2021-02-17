const express = require('express');
const { handleImage } = require('../../middleware/multer');

const router = new express.Router();

router.post("/upload-image", handleImage, async (req, res) => {
    const image = req.file;
    console.log(image);
    if (!image) res.status(422).send({
        code: 422,
        message: "file not found"
    });

});

module.exports = router;