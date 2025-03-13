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
const flash = require('connect-flash');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();

app.use(methodOverride('_method'));

app.get('/favicon.ico', (req, res) => res.status(204).end());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../../public')));

app.use(cookieParser());

app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secure-secret-key');
      req.user = decoded;
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  res.locals.user = req.user; // Gán vào res.locals để dùng trong template
  next();
});

app.use(
  session({
    secret: 'your-secure-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      ttl: 24 * 60 * 60
    }),
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'default-src': ["'self'"],
      'img-src': ['*'],
      'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net']
    },
    contentSecurityPolicy: false
  })
);
app.use((req, res, next) => {
  console.log('Middleware 1: Request received:', req.method, req.url);
  res.locals.truncateContent = helper.truncateContent;
  next();
});
app.use(compression());
app.use(morgan('dev'));

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
