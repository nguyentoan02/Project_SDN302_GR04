const MongoStore = require('connect-mongo');

const isDevelopment = process.env.NODE_ENV === 'development';

const sessionConfig = {
  // Session secret should be a long, random string
  secret: process.env.SESSION_SECRET || 'your-secure-secret-key',

  // Don't save session if unmodified
  resave: false,

  // Don't create session until something stored
  saveUninitialized: false,

  // Use MongoDB to store sessions
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    ttl: 24 * 60 * 60, // Session TTL (1 day)
    crypto: {
      secret: process.env.SESSION_ENCRYPT_SECRET // Encrypt session data
    },
    touchAfter: 24 * 3600 // Only update once per 24 hours unless data changes
  }),

  // Cookie settings
  cookie: {
    // Secure in production, allow HTTP in development
    secure: !isDevelopment,

    // Only send cookie over HTTP(S), not client JavaScript
    httpOnly: true,

    // Cookie same-site policy
    sameSite: isDevelopment ? 'lax' : 'strict',

    // Cookie max age (1 day)
    maxAge: 24 * 60 * 60 * 1000,

    // Cookie domain
    domain: isDevelopment ? 'localhost' : '.yourdomain.com',

    // Cookie path
    path: '/'
  },

  // Enable proxy support for secure cookies behind reverse proxy
  proxy: !isDevelopment,

  // Session name
  name: 'sessionId',

  // Rolling session expiration
  rolling: true
};

module.exports = { sessionConfig };
