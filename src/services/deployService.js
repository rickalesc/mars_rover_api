const deployModel = require('../models/deployModel.js');
const plateauService = require('./plateauService.js');

const deployRover = async (deployData, roverStartingPosition) => {
    try {
        const plateau = await plateauService.getPlateau(deployData.plateauId);
        await validateRoverDeployOnPlateau(plateau, roverStartingPosition)
        const roverToUpdate = await fillRoverData(deployData, roverStartingPosition);
        const deploy = await deployModel.deployRover(deployData, roverToUpdate);
        return deploy;
    } catch (err) {
        throw new Error('Error fetching deploy: ' + err.message);
    }
};

const fillRoverData = async (deploy, roverStartingPosition) => {    
    const rover = {};
    rover.id = deploy.roverId;
    rover.plateauId = deploy.plateauId;
    rover.name = roverStartingPosition.name;
    rover.currentHeight = roverStartingPosition.height;
    rover.currentWidth = roverStartingPosition.width;
    rover.direction = roverStartingPosition.direction;
    return rover;
};

const validateRoverDeployOnPlateau = async (plateau, roverStartingPosition) => {    
    if(roverStartingPosition.width < 0){
        throw new Error("Rover out of bounds width cannot be less then 0")
    }
    if(roverStartingPosition.height < 0){
        throw new Error("Rover out of bounds height cannot be less then 0")
    }
    if(!roverStartingPosition.direction){
        throw new Error("Rover must have a direction to start moving")
    }
    if(roverStartingPosition.width > (plateau.width - 1)){
        throw new Error("Rover out of bounds width cannot be more then " + plateau.width)
    }
    if(roverStartingPosition.height > (plateau.height - 1)){
        throw new Error("Rover out of bounds height cannot be more then " + plateau.height)
    }
};

module.exports = {
    deployRover
};