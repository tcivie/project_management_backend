const { roleList } = require('../../middleware/checkRoles');

const newMessage = (socket, io, data) => {
    // eslint-disable-next-line no-bitwise
    if (socket.roles & roleList.user) {
        return io.to(data.postId).emit('messageReceived', data.message);
    }
    return socket.emit('error', { message: 'Insuffcient permissions.' });
};

module.exports = newMessage;
