const deployService = require('../services/deployService.js');

const deployRover = async (req, resp) => {
    try {
        const { plateauId, roverId } = req.params;
        const { height, width, direction, command } = req.body;
        await validateId(roverId);
        await validateId(plateauId);
        await validateSize(height, width);
        await validateString(direction, command);

        const deploy = await deployService.deployRover({plateauId, roverId, command}, {direction, height, width} );
        return resp.status(200).send(deploy);
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

const validateString = async (direction, command) => {
    if (!direction || typeof direction !== 'string' || direction.trim() === '') {
        const error = new Error('Direction is required and must be a non-empty string.');
        error.status = 400;
        throw error;
    }
    if (!command || typeof command !== 'string' || command.trim() === '') {
        const error = new Error('Command is required and must be a non-empty string.');
        error.status = 400;
        throw error;
    }
}

const validateSize = async (height, width) => {
    if (!height || isNaN(height) || height < 0) {
        const error = new Error('Height must be a positive number!');
        error.status = 400;
        throw error;
    }
    if (!width || isNaN(width) || width < 0) {
        const error = new Error('Width must be a positive number!');
        error.status = 400;
        throw error;
    }
}

module.exports = {
    deployRover
};