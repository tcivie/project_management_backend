const join = (socket, postId) => {
    console.log(postId);
    socket.join(postId);
    console.log(socket);
};

const leave = (socket, postId) => {
    socket.leave(postId);
};

module.exports = { join, leave };
