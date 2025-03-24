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

const app = express();

app.use(methodOverride('_method'));

app.get('/favicon.ico', (req, res) => res.status(204).end());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../../public')));

app.use(cookieParser());

app.use(authStoreLocalUser);

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
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
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
