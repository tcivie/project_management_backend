const express = require('express');

const router = express.Router();

router.get('/userAvatar/:userId', (req, res) => {
    const { userId } = req.params;
    res.sendFile(`${process.cwd()}/uploads/${userId}/avatar.png`);
});

router.get('/postImage/:postId/:imageId', (req, res) => {
    const { postId, imageId } = req.params;
    res.sendFile(`${process.cwd()}/uploads/${postId}/${imageId}`);
});

module.exports = router;
