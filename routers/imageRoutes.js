const express = require('express');

const router = express.Router();

router.get('/userAvatar/', (req, res) => {
    const { image } = req.params;
    if (image) {
        res.sendFile(`${process.cwd()}/${image}`);
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
});

router.get('/postImage/:image', (req, res) => {
    const { image } = req.params;
    if (image) {
        console.log('Sending image', `${process.cwd()}/${image}`);
        res.sendFile(`${process.cwd()}/${image}`);
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
});

module.exports = router;
