require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { successHandler } = require('../core/success');
const { handleError } = require('../core/error');
const bodyParser = require('body-parser');
const router = require('../routes');

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Success handler middleware
app.use(successHandler);

// Routes
app.use('/api', router);

// Error handling

app.use(handleError);

module.exports = app;
