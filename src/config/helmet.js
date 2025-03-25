const isDevelopment = process.env.NODE_ENV === 'development';
const hostUrl = `http://${process.env.HOST}:${process.env.PORT}`;

// Helmet Security Configuration
const helmetConfig = {
  // Content Security Policy (CSP)
  // Controls which resources can be loaded and from where
  contentSecurityPolicy: {
    directives: {
      // Restricts sources for all fetch operations
      defaultSrc: ["'self'"],

      // Controls which scripts can be executed
      scriptSrc: [
        "'self'", // Allow scripts from same origin
        "'unsafe-inline'", // Allow inline scripts
        'https://cdn.jsdelivr.net',
        ...(isDevelopment ? ["'unsafe-eval'"] : []) // Allow eval in development
      ],

      // Controls stylesheet sources
      styleSrc: [
        "'self'", // Allow styles from same origin
        "'unsafe-inline'", // Allow inline styles
        'https://cdn.jsdelivr.net'
      ],

      // Controls image sources
      imgSrc: [
        "'self'", // Allow images from same origin
        'data:', // Allow data: URIs
        'https:', // Allow HTTPS images
        ...(isDevelopment ? ['http:'] : []) // Allow HTTP in development
      ],

      // Controls XMLHttpRequest, WebSocket, etc
      connectSrc: [
        "'self'", // Allow connections to same origin
        isDevelopment
          ? 'http://localhost:3000' // Development API endpoint
          : hostUrl // Production API endpoint
      ],

      // Controls font loading sources
      fontSrc: [
        "'self'", // Allow fonts from same origin
        'https://cdn.jsdelivr.net'
      ],

      // Prevents all object content
      objectSrc: ["'none'"], // Block <object>, <embed>, and <applet>

      // Controls media file sources (audio/video)
      mediaSrc: ["'self'"], // Allow media from same origin

      // Controls frame sources
      frameSrc: ["'none'"], // Block all iframes

      // Upgrades HTTP requests to HTTPS in production
      upgradeInsecureRequests: isDevelopment ? null : []
    }
  },

  // Allows browsers to load resources from different origins
  crossOriginEmbedderPolicy: false,

  // Controls how the resource can be embedded in other sites
  crossOriginResourcePolicy: {
    policy: 'cross-origin' // Allow cross-origin resource sharing
  },

  // Controls DNS prefetching
  dnsPrefetchControl: {
    allow: false // Disable DNS prefetching
  },

  // Prevents clickjacking using frame/iframe
  frameguard: {
    action: 'deny' // Block all framing
  },

  // Removes the X-Powered-By header
  hidePoweredBy: true, // Hide server technology

  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // How long browser should remember HTTPS-only
    includeSubDomains: true, // Apply to all subdomains
    preload: true // Allow preloading of HSTS
  },

  // Prevents IE from executing downloads
  ieNoOpen: true, // Force save downloads

  // Prevents MIME type sniffing
  noSniff: true, // Enforce declared content-type

  // Controls how much referrer info should be included
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  },

  // Basic XSS protection for older browsers
  xssFilter: true // Enable built-in XSS filter
};

//Helmet config for HTTP version
const helmetConfigHTTP = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://cdn.jsdelivr.net',
        'http://46.137.195.183:3000',
        'https://fonts.googleapis.com'
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://cdn.jsdelivr.net',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ],
      imgSrc: ["'self'", 'data:', 'http:', 'https:', 'http://46.137.195.183:3000'],
      connectSrc: ["'self'", 'http://46.137.195.183:3000', 'ws://46.137.195.183:3000'],
      fontSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
      upgradeInsecureRequests: null
    }
  },

  // Disable HTTPS-only features when running on HTTP
  hsts: false,

  // Allow cross-origin resources
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  }
};

module.exports = { helmetConfig, helmetConfigHTTP };
