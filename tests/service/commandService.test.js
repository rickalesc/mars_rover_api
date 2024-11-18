const commandService = require('../../src/services/commandService');
const roverService = require('../../src/services/roverService');
const plateauService = require('../../src/services/plateauService');
const commandModel = require('../../src/models/commandModel');

jest.mock('../../src/services/roverService');
jest.mock('../../src/services/plateauService');
jest.mock('../../src/models/commandModel');

describe('commandService', () => {
  describe('commandRover', () => {
    const mockRover = {
      id: 1,
      name: 'Rover1',
      direction: 'N',
      currentHeight: 1,
      currentWidth: 1,
      plateauId: 1,
    };

    const mockPlateau = {
      id: 1,
      width: 5,
      height: 5,
    };

    const mockCommandData = {
      command: 'MMRML',
      roverId: 1,
      plateauId: 1,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should execute commands successfully and return the updated command data', async () => {
      roverService.getRover.mockResolvedValue(mockRover);
      plateauService.getPlateau.mockResolvedValue(mockPlateau);
      commandModel.commandRover.mockResolvedValue({
        id: 1,
        command: 'MMRML',
        roverId: 1,
        plateauId: 1,
      });

      const result = await commandService.commandRover(mockCommandData);

      expect(roverService.getRover).toHaveBeenCalledWith(mockCommandData.roverId);      
      expect(plateauService.getPlateau).toHaveBeenCalledWith(mockCommandData.plateauId);
      console.log(result)
      expect(commandModel.commandRover).toHaveBeenCalledWith(
        expect.objectContaining({ 
          command: 'MMRML',
          initialHeight:1,
          initialWidth:1,
          plateauId:1,
          roverId:1
        }),
        expect.objectContaining({
          currentHeight:3,
          currentWidth:2,
          direction: 'N', 
          id: 1,
          name: 'Rover1',
          plateauId: 1
        })
      );
      console.log(result)
      expect(result).toHaveProperty('command', 'MMRML');
    });

    it('should throw an error if the rover exceeds the plateau limits', async () => {
      roverService.getRover.mockResolvedValue(mockRover);
      plateauService.getPlateau.mockResolvedValue(mockPlateau);

      const invalidCommandData = { ...mockCommandData, command: 'MMMMMM' };

      await expect(commandService.commandRover(invalidCommandData)).rejects.toThrow(
        'The command you entered exceded the north border'
      );
      expect(commandModel.commandRover).not.toHaveBeenCalled();
    });

    it('should throw an error if the rover is not deployed on a plateau', async () => {
      roverService.getRover.mockResolvedValue({ ...mockRover, plateauId: null });

      await expect(commandService.commandRover(mockCommandData)).rejects.toThrow(
        'Rover Rover1 not deployed'
      );
      expect(commandModel.commandRover).not.toHaveBeenCalled();
    });

    it('should throw an error if the rover is deployed on a different plateau', async () => {
      roverService.getRover.mockResolvedValue({ ...mockRover, plateauId: 2 });

      await expect(commandService.commandRover(mockCommandData)).rejects.toThrow(
        'Rover Rover1 deployed in another plateau'
      );
      expect(commandModel.commandRover).not.toHaveBeenCalled();
    });

    it('should throw an error if the plateauService.getPlateau fails', async () => {
      roverService.getRover.mockResolvedValue(mockRover);
      plateauService.getPlateau.mockRejectedValue(new Error('Plateau not found'));

      await expect(commandService.commandRover(mockCommandData)).rejects.toThrow(
        'Plateau not found'
      );
      expect(commandModel.commandRover).not.toHaveBeenCalled();
    });

    it('should throw an error if commandModel.commandRover fails', async () => {
      roverService.getRover.mockResolvedValue(mockRover);
      plateauService.getPlateau.mockResolvedValue(mockPlateau);
      commandModel.commandRover.mockRejectedValue(new Error('Database error'));

      await expect(commandService.commandRover(mockCommandData)).rejects.toThrow(
        'Database error'
      );
    });

    it('should validate ID inputs and throw an error for invalid IDs', async () => {
      const invalidCommandData = { ...mockCommandData, roverId: 'abc' };

      await expect(commandService.commandRover(invalidCommandData)).rejects.toThrow(
        'Invalid id, must be a number'
      );
      expect(roverService.getRover).not.toHaveBeenCalled();
    });
  });
});