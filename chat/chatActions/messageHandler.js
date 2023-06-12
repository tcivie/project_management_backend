const { roleList } = require('../../middleware/checkRoles');
const messages = require('../../models/Chat/Messages');

async function createMessage(postId, userId, content, replyTo) {
    return messages.create({
        postId, userId, content, replyTo,
    });
}
const newMessage = (socket, io, data) => {
    // eslint-disable-next-line no-bitwise
    if (socket.roles & roleList.user) {
        // console.log('io:', io);
        // console.log('data:', data);
        createMessage(data.postId, socket.userId, data.sendValue, null).then(
            (message) => io.to(data.postId).emit('messageReceived', message),
        );
    }
    return socket.emit('error', { message: 'Insuffcient permissions.' });
};

module.exports = newMessage;
