module.exports = {
  dev: {
    'default-src': ["'self'"], // can be either a string or an array.
    'style-src': ["'self'", "'unsafe-inline'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://*.mixpanel.com'],
    'img-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      'data:',
      'https://*.mixpanel.com',
      'wss://stafi-seiya-rewrite.stafi.io',
      'wss://mainnet-rpc.stafi.io',
    ],
  },
  prod: {
    'default-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://*.mixpanel.com'],
    'img-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      'data:',
      'https://*.mixpanel.com',
      'wss://stafi-seiya-rewrite.stafi.io',
      'wss://mainnet-rpc.stafi.io',
    ],
  },
};
