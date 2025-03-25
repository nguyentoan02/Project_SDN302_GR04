const isDevelopment = process.env.NODE_ENV === 'development';
console.log({ isDevelopment });

const corsOptions = {
  origin: isDevelopment ? ['http://localhost:3000'] : ['https://yourdomain.com'], // Add your production domain
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

module.exports = { corsOptions, isDevelopment };
