const plateauService = require('../services/plateauService.js');

const getPlateaus = async (req, resp) => {
    try {
        const plateaus = await plateauService.getPlateaus();
        return resp.status(200).send(plateaus);
    } catch (err) {
        return resp.status(500).send({ error: err.message });
    }
};

const getPlateau = async (req, resp) => {
    const { id } = req.params;
    try {
        await validateId(id);

        const plateau = await plateauService.getPlateau(id);
        return resp.send(plateau);
    } catch (err) {
        if(err.status){
            return resp.status(err.status).send({ error: err.message });
        }
        return resp.status(500).send({ error: err.message });
    }
};

const createPlateau = async (req, resp) => {
    const { name, height, width } = req.body;
    try {
        await validateName(name);
        await validateSize(height, width);

        const newPlateau = await plateauService.createPlateau({ name, height, width });
        return resp.status(201).send(newPlateau);
    } catch (err) {
        if(err.status){
            return resp.status(err.status).send({ error: err.message });
        }
        return resp.status(500).send({ error: err.message });
    }
};

const updatePlateau = async (req, resp) => {
    const { id } = req.params
    const { name, height, width } = req.body;
    try {
        await validateId(id);
        await validateName(name);
        await validateSize(height, width);

        const updatedPlateau = await plateauService.updatePlateau({id, name, height, width });
        return resp.status(201).send(updatedPlateau);
    } catch (err) {
        if(err.status){
            return resp.status(err.status).send({ error: err.message });
        }
        return resp.status(500).send({ error: err.message });
    }
};

const deletePlateau = async (req, resp) => {
    const { id } = req.params
    try {
        await validateId(id);
        const deleted = await plateauService.deletePlateau({ id });
        if(deleted === 0){
            resp.status(404).send({ error: 'Plateau not found' })
        } else {
            resp.status(200).send({ message: 'Plateau deleted successfully' })
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

const validateSize = async (height, width) => {
    if (!height || isNaN(height) || height <= 0) {
        const error = new Error('Height must be a positive number!');
        error.status = 400;
        throw error;
    }
    if (!width || isNaN(width) || width <= 0) {
        const error = new Error('Width must be a positive number!');
        error.status = 400;
        throw error;
    }
}

module.exports = {
    getPlateaus,
    getPlateau,
    createPlateau,
    updatePlateau,
    deletePlateau
};