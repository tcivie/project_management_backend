const { roleList } = require('../../middleware/checkRoles');

const newMessage = (socket, io, data) => {
    // eslint-disable-next-line no-bitwise
    if (socket.roles & roleList.user) {
        console.log('socket:', socket);
        console.log('io:', io);
        console.log('data:', data);
        return io.to(data.postId).emit('messageReceived', data.sendValue);
    }
    return socket.emit('error', { message: 'Insuffcient permissions.' });
};

module.exports = newMessage;
