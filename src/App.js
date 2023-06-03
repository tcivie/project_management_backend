// import express from 'express';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRoutes = require('../routers/apiRoutes');
const { logger } = require('../middleware/logger');

const app = express();

app.use(logger);

app.use(cors());

// configure body-parser middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// api routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Nothing to see here</h1>');
});

app.all('*', (req, res) => {
    res.status(404).json({ message: `Cannot find ${req.originalUrl} on this server.` });
});

module.exports = app;
