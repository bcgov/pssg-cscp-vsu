const PROXY_CONFIG = [
  {
    context: ['/api', '/vsuwebforms/api', '/vsuwebforms/hc'],
    target: 'http://localhost:5000',
    secure: false,
    logLevel: 'error',
    pathRewrite: {
      '^/vsuwebforms': ''
    }
  }
];

module.exports = PROXY_CONFIG;
