const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    // console.log('Verifying JWT');
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        req.id = null;
        req.user = null;
        req.roles = 0;
        req.active = false;
        next();
    } else {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log('Error', err);
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.id = decoded.UserInfo.id;
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            req.active = decoded.UserInfo.active;
            next();
        });
    }
};

module.exports = verifyJWT;
