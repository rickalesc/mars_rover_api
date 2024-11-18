const roverService = require('../services/roverService.js');

const getRovers = async (req, resp) => {
    try {
        const rovers = await roverService.getRovers();
        return resp.status(200).send(rovers);
    } catch (err) {
        return resp.status(500).send({ error: err.message });
    }
};

const getRover = async (req, resp) => {        
    const { id } = req.params;
    try {
        await validateId(id, resp);

        const rover = await roverService.getRover(id);
        if(!rover){
            return resp.status(404).send({ error: 'Rover not found' });
        }
        return resp.status(200).send(rover);
    } catch (err) {
        if(err.status){
            return resp.status(err.status).send({ error: err.message });
        }
        return resp.status(500).send({ error: err.message });
    }
};

const createRover = async (req, resp) => {
    const { name } = req.body;
    try {
        await validateName(name, resp);

        const newRover = await roverService.createRover({ name });
        return resp.status(201).send(newRover);
    } catch (err) {
        if(err.status){
            return resp.status(err.status).send({ error: err.message });
        }
        return resp.status(500).send({ error: err.message });
    }
};

const updateRover = async (req, resp) => {
    const { id } = req.params;
    const { name, plateauId, currentHeight, currentWidth, direction } = req.body;
    try {
        await validateId(id, resp);
        await validateName(name, resp);

        const updatedPlateau = await roverService.updateRover({ id, name, plateauId, currentHeight, currentWidth, direction });
        return resp.status(201).send(updatedPlateau);
    } catch (err) {
        if(err.status){
            return resp.status(err.status).send({ error: err.message });
        }
        return resp.status(500).send({ error: err.message });
    }
};

const deleteRover = async (req, resp) => {
    const { id } = req.params;
    try {
        await validateId(id, resp);

        const deleted = await roverService.deleteRover(id);
        if(deleted === 0){
            resp.status(404).send({ error: 'Rover not found' });
        } else {
            resp.status(200).send({ message: 'Rover deleted successfully' });
        }
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

const validateName = async (name) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
        const error = new Error('Name is required and must be a non-empty string.');
        error.status = 400;
        throw error;
    }
}

module.exports = {
    getRovers,
    getRover,
    createRover,
    updateRover,
    deleteRover
};