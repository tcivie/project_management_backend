const express = require('express');
const User = require('../models/userModule');

const router = express.Router();

router.post('/register', async (req, res) => {
    const ret = { register: false };
    try {
        const { email, username, password } = req.body;
        const nickname = username;
        const hashedPassword = password;
        const user = await User.create({
            email,
            username,
            hashedPassword,
            nickname,
        });
        await user.hashPassword();
        await user.save();
        ret.register = true;
        res.status(200).json(ret);
    } catch (error) {
        ret.error = error;
        res.status(400).json(ret);
    }
});

router.post('/login', async (req, res) => {
    const ret = { login: true };
    try {
        const { identifier, password } = req.body;
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });
        if (!user || !(await user.validPassword(password))) {
            ret.login = false;
        }
        res.status(ret.login ? 200 : 404).json(ret);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
