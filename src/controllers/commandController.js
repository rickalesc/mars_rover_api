const commandService = require('../services/commandService.js');

const commandRover = async (req, resp) => {
    try {
        const { plateauId, roverId } = req.params;
        const { command } = req.body;
        await validateId(plateauId);
        await validateId(roverId);
        await validateCommand(command);

        const commandExecuted = await commandService.commandRover({plateauId, roverId, command});
        return resp.send(commandExecuted);
    } catch (err) {
        if(err.status){
            return resp.status(err.status).send({ error: err.message });
        }
        return resp.status(500).send({ error: err.message });
    }
};

const validateId = async (id) => {
    if (!/^\d+$/.test(id)) {
        const error = new Error('Invalid ID. Must be a positive integer.');
        error.status = 400;
        throw error;
    }
}

const validateCommand = async (command) => {
    if (!command || typeof command !== 'string' || command.trim() === '') {
        const error = new Error('Command is required and must be a non-empty string.');
        error.status = 400;
        throw error;
    }
}

module.exports = {
    commandRover
};