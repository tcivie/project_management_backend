const socketIO = require('socket.io');

function socketSetup(server) {
    const io = socketIO(server, {
        cors: {
            origin: '*', // replace with your HTML file's origin
            methods: ['GET', 'POST'],
        },
    });

    io.use((socket, next) => {
        // Middleware logic goes here
        // If everything is okay, call next();
        // otherwise, call next(new Error('An error occurred.'));
        next();
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        // Handle join event
        socket.on('join', (postId) => {
            socket.join(postId);
            console.log(`Client joined room ${postId}`);
        });

        // Handle new message event
        socket.on('newMessage', (data) => {
            console.log(`New message in room ${data.postId}`);
            // Emit the message to everyone in the room
            io.to(data.postId).emit('messageReceived', data.message);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        // Additional event handlers go here
    });

    return io;
}

module.exports = socketSetup;
