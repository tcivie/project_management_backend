const socketIO = require('socket.io');
const verifySocketJWT = require('../chat/verifySocketJWT');
const { join, leave } = require('../chat/chatActions/sessionHandler');
const newMessage = require('../chat/chatActions/messageHandler');

function socketSetup(server) {
    const io = socketIO(server, {
        cors: {
            origin: '*', // replace with your HTML file's origin
            methods: ['GET', 'POST'],
        },
    });

    io.use(verifySocketJWT); // Use the middleware to verify the JWT

    io.on('connection', (socket) => {
        socket.on('join', (postId) => join(socket, postId));

        socket.on('newMessage', (data) => newMessage(socket, io, data));

        socket.on('disconnect', () => leave(socket));
    });

    return io;
}

module.exports = socketSetup;
