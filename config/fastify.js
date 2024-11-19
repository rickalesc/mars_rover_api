const fastify = require('fastify');
const app = fastify({
  connectionTimeout: 10000,
  logger: true
});

module.exports = app;