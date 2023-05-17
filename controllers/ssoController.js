const { OAuth2Client } = require('google-auth-library');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const crypto = require('crypto');
const { registerUser } = require('./usersController');
const generateTokensAndResponse = require('../utils/tokenGeneration');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc Google Sign-In
// @route POST /api/sso/google
// @access Public
const googleSignIn = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();

    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) {
        const randomPassword = crypto.randomBytes(16).toString('hex');
        // create new user
        req.isSSO = true;
        req.body = {
            username: email,
            password: randomPassword,
            name: name,
            email: email,
            picture: picture,
        };
        const newUser = await registerUser(req, res);
        return generateTokensAndResponse(res, newUser);
    } else {
        return generateTokensAndResponse(res, foundUser);
    }
});

module.exports = {
    googleSignIn,
};
