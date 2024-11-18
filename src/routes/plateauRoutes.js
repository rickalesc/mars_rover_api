const plateauController = require('../controllers/plateauController.js');

const plateauRoutes = async (fastify) => {
  fastify.get('/api/plateaus', plateauController.getPlateaus);
  fastify.get('/api/plateaus/:id', plateauController.getPlateau);
  fastify.post('/api/plateaus', plateauController.createPlateau);
  fastify.post('/api/plateaus/:id', plateauController.updatePlateau);
  fastify.delete('/api/plateaus/:id', plateauController.deletePlateau);
};

module.exports = plateauRoutes;