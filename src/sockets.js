const socketIO = require('socket.io');

function socketSetup(server) {
    const io = socketIO(server);

    io.use((socket, next) => {
        // Middleware logic goes here
        // If everything is okay, call next();
        // otherwise, call next(new Error('An error occurred.'));
        next();
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        // Additional event handlers go here
    });

    return io;
}

module.exports = socketSetup;
