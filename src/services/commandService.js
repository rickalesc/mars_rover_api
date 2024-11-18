const commandModel = require('../models/commandModel.js');
const roverService = require('./roverService.js')
const plateauService = require('./plateauService.js')

const commandRover = async (commandData) => {
    try {
        let rover = await getRover(commandData);
        commandData.initialHeight = rover.currentHeight;
        commandData.initialWidth = rover.currentWidth;
        await validateRoverLocation(rover, commandData);
        rover = await executeCommand(rover, commandData);

        const command = await commandModel.commandRover(commandData, rover);

        return command;
    } catch (err) {
        const error = new Error(err.message);
        error.status = err.status ? err.status : 500;
        throw error;
    }
};

const executeCommand = async (rover, commandData) => {
    let facingDirection = rover.direction;
    let heightPosition = rover.currentHeight;
    let widthPosition = rover.currentWidth;
    for (let command of commandData.command) {
        if(command === 'M' ){
           ({ heightPosition, widthPosition } = await moveRover(heightPosition, widthPosition, facingDirection))
        } else {
            facingDirection = await rotateRover(command, facingDirection);
        }
        await validatePosition(rover, heightPosition, widthPosition,)
    }
    rover.direction = facingDirection;
    rover.currentHeight = heightPosition;
    rover.currentWidth = widthPosition;
    return rover;
}

const moveRover = async (heightPosition, widthPosition, facingDirection) => {
    switch (facingDirection) {
        case 'N':
            heightPosition += 1;
            break;
        case 'E':
            widthPosition += 1;
            break;
        case 'S':
            heightPosition -= 1;
            break;
        case 'W':
            widthPosition -= 1;
            break;
    }
    return { heightPosition, widthPosition };
}

const validatePosition = async (rover, heightPosition, widthPosition) => {
    await validateLowerLimits(heightPosition, widthPosition);
    await validateUpperLimits(heightPosition, widthPosition, rover.plateauId);
}

const validateLowerLimits = async (heightPosition, widthPosition) => {
    if(widthPosition < 0){
        const error = new Error('The command you entered exceded the west border');
        error.status = 404;
        throw error;
    }
    if(heightPosition < 0){
        const error = new Error('The command you entered exceded the south border');
        error.status = 404;
        throw error;
    }
}

const validateUpperLimits = async (heightPosition, widthPosition, plateauId) => {
    const plateau = await plateauService.getPlateau(plateauId);
    if(widthPosition > plateau.width){
        const error = new Error('The command you entered exceded the east border');
        error.status = 404;
        throw error;
    }
    if(heightPosition > plateau.height){
        const error = new Error('The command you entered exceded the north border');
        error.status = 404;
        throw error;
    }
}

const rotateRover = async (command, facingDirection) => {
    const directions = ['N', 'E', 'S', 'W'];
    let directionIndex = directions.indexOf(facingDirection);
    if(command === 'L'){
        directionIndex = (directionIndex - 1 + directions.length) % directions.length;
    } else if(command === 'R'){
        directionIndex = (directionIndex + 1) % directions.length;
    }
    return directions[directionIndex];
}

const validateId = async (id) => {
    const returnId = parseInt(id, 10);
    if (isNaN(returnId)) {
        const error = new Error('Invalid id, must be a number');
        error.status = 404;
        throw error;
    }
    return returnId;
}

const validateRoverLocation = async (rover, commandData) => {    
    const plateauId = await validateId(commandData.plateauId);
    if(!rover.plateauId){
        const error = new Error('Rover ' + rover.name + ' not deployed');
        error.status = 404;
        throw error;
    }
    if(!(rover.plateauId === plateauId)){
        const error = new Error('Rover ' + rover.name + ' deployed in another plateau');
        error.status = 404;
        throw error;
    }
};

const getRover = async (commandData) => {    
    const roverId = await validateId(commandData.roverId);
    return await roverService.getRover(roverId);
};

module.exports = {
    commandRover
};