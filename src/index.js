require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const app = require('./App');
const socketSetup = require('./sockets');

const appPort = process.env.PORT || 3000;
const socketPort = process.env.SOCKETPORT || 4000; // The port for the Socket.IO server

const appServer = http.createServer(app);
const socketServer = http.createServer(); // Create a new server for Socket.IO

mongoose
    .connect(process.env.DBURL)
    .then(() => {
        appServer.listen(appPort, () => {
            // eslint-disable-next-line no-console
            console.log(`App running at port ${appPort}`);
        });
        socketServer.listen(socketPort, () => { // Start the Socket.IO server
            // eslint-disable-next-line no-console
            console.log(`Socket.IO server running at port ${socketPort}`);
        });
    })
    .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
    });

socketSetup(socketServer); // Pass the socketServer to the socketSetup function
