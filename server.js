const fastify = require('./config/fastify.js');
const plateauRoutes = require('./src/routes/plateauRoutes.js');
const roverRoutes = require('./src/routes/roverRoutes.js');
const deployRoutes = require('./src/routes/deployRoutes.js');
const commandRoutes = require('./src/routes/commandRoutes.js');

fastify.register(plateauRoutes);
fastify.register(roverRoutes);
fastify.register(deployRoutes);
fastify.register(commandRoutes);
fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:3000','http://localhost:5173', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

fastify.listen({port: 3333} , (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server running at ${address}`);
});