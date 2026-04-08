const corsLib = require('cors');

const allowedOrigins = [
  'https://xsavlab.web.app',
  'https://xsavlab.firebaseapp.com',
  'https://xsavlab.com',
  'https://www.xsavlab.com',
  'http://localhost:3000',
  'http://localhost:5000',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      console.warn('CORS blocked: No origin header');
      return callback(new Error('Not allowed by CORS'));
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

const cors = corsLib(corsOptions);

function ensureMethod(req, res, methods) {
  const allowedMethods = Array.isArray(methods) ? methods : [methods];

  if (allowedMethods.includes(req.method)) {
    return true;
  }

  res.status(405).json({ error: 'Method not allowed' });
  return false;
}

module.exports = {
  cors,
  ensureMethod,
};