const mongoose = require('mongoose');
const http = require('http');
const app = require('./App');
const socketSetup = require('./sockets');

const port = process.env.port || 3000;

const server = http.createServer(app);

mongoose
    .connect(process.env.DBURL)
    .then(() => {
        server.listen(port, () => {
            console.log(`Connected to DB and running at port ${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

socketSetup(server);
