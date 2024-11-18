const commandController = require('../controllers/commandController.js');

const commandRoutes = async (fastify) => {
  fastify.post('/api/plateau/:plateauId/rover/:roverId/command', commandController.commandRover);
};

module.exports = commandRoutes;