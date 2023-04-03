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
        ret.user = user;
        res.status(200).json(ret);
    } catch (error) {
        ret.error = error;
        res.status(400).json(ret);
    }
});

router.post('/login', async (req, res) => {
    const ret = { Login: true };
    try {
        const { email = null, username = null, password } = req.body;
        if (email && username) {
            res.status(400).json({ Error: 'Only one param allowed' });
            return;
        }
        const user = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (username) ret.username = username;
        else if (email) ret.email = email;
        if (!user || !(await user.validPassword(password))) {
            ret.Login = false;
        }
        res.status(ret.Login ? 200 : 404).json(ret);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
