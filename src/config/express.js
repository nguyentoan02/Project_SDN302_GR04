require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const { successHandler } = require('../core/success');
const { handleError } = require('../core/error');
const router = require('../routes');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const helper = require('../utils/helper');
const session = require('express-session');
const { authStoreLocalUser } = require('../middleware/auth');
const { corsOptions } = require('./cors');
const { helmetConfig } = require('./helmet');
const { sessionConfig } = require('./session');

const app = express();

const isDevelopment = process.env.NODE_ENV === 'development';

app.use(methodOverride('_method'));

app.get('/favicon.ico', (req, res) => res.status(204).end());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../../public')));
// Middleware
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session(sessionConfig));

app.use(cors(corsOptions));

app.use(helmet(helmetConfig));

app.use(authStoreLocalUser);

app.use((req, res, next) => {
  console.log('Middleware 1: Request received:', req.method, req.url);
  // res.locals.API_URL = config.API_URL;
  res.locals.NODE_ENV = process.env.NODE_ENV;
  res.locals.truncateContent = helper.truncateContent;
  next();
});

app.use(successHandler);

// Routes
app.use('/api', router);
app.use('/', require('../routes/views/view.routes'));

app.all('*', (req, res, next) => {
  res.status(404).render('404', {
    title: '404 Not Found',
    message: `Cannot find ${req.originalUrl} on this server!`
  });
});

app.use(handleError);

module.exports = app;
