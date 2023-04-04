// import express from 'express';
require('dotenv').config();

const port = process.env.port || 3000;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('../routers/users');

const app = express();

app.use(cors());
// configure body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// user routes
app.use('/api/users', userRoutes);

// connect to DB
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

app.get('/', (req, res) => {
    res.send('<h1>Nothing to see here</h1>');
});
