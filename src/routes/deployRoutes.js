const deployController = require('../controllers/deployController.js');

const deployRoutes = async (fastify) => {
  fastify.post('/api/plateau/:plateauId/rover/:roverId/deploy', deployController.deployRover);
};

module.exports = deployRoutes;