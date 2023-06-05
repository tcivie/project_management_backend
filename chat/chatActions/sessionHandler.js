const join = (socket, postId) => {
    socket.join(postId);
};

const leave = (socket, postId) => {
    socket.leave(postId);
};

module.exports = { join, leave };
