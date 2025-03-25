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

module.exports = { helmetConfig };
