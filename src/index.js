const mongoose = require('mongoose');
const app = require('./App');
const cities = require('../models/City');
const port = process.env.port || 3000;

mongoose
    .connect(process.env.DBURL)
    .then(() => {
        app.listen(port, () => {
            console.log(`Connected to DB and running at port ${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
