const plateauModel = require('../models/plateauModel.js');

const getPlateaus = async () => {
    try {
        const plateaus = await plateauModel.getAllPlateaus();
        return plateaus;
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        throw error;
    }
};

const getPlateau = async (id) => {
    try {
        const plateau = await plateauModel.getPlateauById(id);
        if (!plateau) {
            const error = new Error('Plateau not found');
            error.status = 400;
            throw error;
        }
        return plateau;
    } catch (err) {
        const error = new Error(err.message);
        error.status = err.status;
        throw error;
    }
};

const createPlateau = async (data) => {
    try {
        await validatePlateauSize(data);
        const newPlateau = await plateauModel.createPlateau(data);
        return newPlateau[0];
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        throw error;
    }
};

const updatePlateau = async (data) => {
    try {
        const { id, width, height, name } = data;
        const validated = await validatePlateauSize({ width, height, name });
        const updatedPlateau = await plateauModel.updatePlateau(id, { width, height, name });
        return updatedPlateau[0];
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        throw error;
    }
};

const deletePlateau = async (id) => {
    try {
        const validatedId = await validateId(id.id)
        const result = await plateauModel.deletePlateau(validatedId);
        return result; 
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        throw error;
    }
};

const validateId = async (id) => {
    const returnId = parseInt(id, 10);
    if (isNaN(returnId)) {
        throw new Error('Invalid id, must be a number');
    }
    return returnId;
}

const validatePlateauSize = async (plateau) => {
    if(plateau.height < 1 || plateau.height > 50){
        throw new Error('Height value must be between 1 and 50');
    }
    if(plateau.width < 1 || plateau.width > 50){
        throw new Error('Width value must be between 1 and 50');
    }
};

module.exports = {
    getPlateaus,
    getPlateau,
    createPlateau,
    updatePlateau,
    deletePlateau
};