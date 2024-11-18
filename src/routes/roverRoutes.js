const roverController = require('../controllers/roverController.js');

const roverRoutes = async (fastify) => {
  fastify.get('/api/rovers', roverController.getRovers);
  fastify.get('/api/rovers/:id', roverController.getRover);
  fastify.post('/api/rovers', roverController.createRover);
  fastify.post('/api/rovers/:id', roverController.updateRover);
  fastify.delete('/api/rovers/:id', roverController.deleteRover);
};

module.exports = roverRoutes;