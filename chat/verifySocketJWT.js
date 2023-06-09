require('socket.io');
const jwt = require('jsonwebtoken');

function verifySocketJWT(socket, next) {
    const { token } = socket.handshake.auth;
    if (!token) {
        return next(new Error('Authentication error'));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error'));
        }
        socket.userId = decoded.UserInfo.id;
        socket.user = decoded.UserInfo.username;
        socket.roles = decoded.UserInfo.roles;
        socket.active = decoded.UserInfo.active;
        next();
    });
}

module.exports = verifySocketJWT;
