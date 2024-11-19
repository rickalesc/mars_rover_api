const fastify = require('./config/fastify.js')
const swagger = require('@fastify/swagger');
const swaggerUi = require('@fastify/swagger-ui');
const plateauRoutes = require('./src/routes/plateauRoutes.js');
const roverRoutes = require('./src/routes/roverRoutes.js');
const deployRoutes = require('./src/routes/deployRoutes.js');
const commandRoutes = require('./src/routes/commandRoutes.js');

fastify.register(swagger, {
  swagger: {
    info: {
      title: 'Mars Rover API',
      description: 'API documentation for the Mars Rover application',
      version: '1.0.0',
    },
    host: 'localhost:3333',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});

fastify.register(swaggerUi, {
  routePrefix: '/docs', 
  uiConfig: {
    docExpansion: 'none',
    deepLinking: false,
  },
});

fastify.register(plateauRoutes);
fastify.register(roverRoutes);
fastify.register(deployRoutes);
fastify.register(commandRoutes);
fastify.register(require('@fastify/cors'), {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

fastify.listen({port: 3333, host: '0.0.0.0'} , (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server running at ${address}`);
  fastify.log.info(`Swagger docs available at ${address}/docs`);
});