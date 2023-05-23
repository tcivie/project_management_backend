const jwt = require('jsonwebtoken');
const generateTokensAndResponse = async (res, user) => {
    const accessToken = jwt.sign(
        {
            UserInfo: {
                username: user.username,
                roles: user.roles,
                active: user.active,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' },
    );

    // Create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send accessToken containing username and roles
    return res.json({
        accessToken: accessToken,
        UserInfo: {
            username: user.username,
        },
    });
};

module.exports = generateTokensAndResponse;
