// Listen on a specific host via the HOST environment variable
const host = process.env.HOST || '127.0.0.1';
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 8080;
console.log('Starting CORS Anywhere on ' + host + ':' + port);
const CORSProxy = require('cors-anywhere');
CORSProxy.createServer({
  originWhitelist: [/* 'localhost:*' */], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, () => {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});
