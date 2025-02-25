require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const { successHandler } = require('../core/success');
const { handleError } = require('../core/error');
const bodyParser = require('body-parser');
const router = require('../routes');

const app = express();
// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false // For development only
  })
);
app.use(compression());
app.use(morgan('dev'));

// Success handler middleware
app.use(successHandler);

// Routes
app.use('/api', router);
app.use('/', require('../routes/views/view.routes'));

// 404 Handler
app.all('*', (req, res, next) => {
  res.status(404).render('404', {
    title: '404 Not Found',
    message: `Cannot find ${req.originalUrl} on this server!`
  });
});

// Error handling
app.use(handleError);

module.exports = app;
