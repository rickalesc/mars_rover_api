const { getPlateauById } = require('../models/plateauModel.js');
const roverModel = require('../models/roverModel.js');
const plateauService = require('./plateauService.js');

const getRovers = async () => {
    try {
        const rovers = await roverModel.getAllRovers();
        await fillRoverStatus(rovers);
        return rovers;
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        throw error;
    }
};

const getRover = async (id) => {
    try {
        const rover = await roverModel.getRoverById(id);
        if (!rover) {
            const error = new Error('Rover not found');
            error.status = 404;
            throw error;
        }
        return rover;
    } catch (err) {
        const error = new Error(err.message);
        error.status = err.status;
        throw error;
    }
};

const createRover = async (rover) => {
    try {
        const newRover = await roverModel.createRover(rover);
        newRover[0].status = 'At Base'
        return newRover[0];
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        throw error;
    }
};

const updateRover = async (data) => {
    try {
        const { id, name, plateauId, currentHeight, currentWidth, direction } = data;
        const updatedRover = await roverModel.updateRover(id, { name, plateauId, currentHeight, currentWidth, direction });
        return updatedRover[0];
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        throw error;
    }
};

const deleteRover = async (id) => {
    try {
        const result = await roverModel.deleteRover(id);
        return result; 
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        throw error;
    }
};

const fillRoverStatus = async (rovers) => {
    for (let rover of rovers) {
        if(rover.plateauId){
            let plateau = await plateauService.getPlateau(rover.plateauId);
            rover.status = 'Deployed at ' + plateau.name; 
        } else{
            rover.status = 'At Base'
        }
    }
}

module.exports = {
    getRovers,
    getRover,
    createRover,
    updateRover,
    deleteRover
};