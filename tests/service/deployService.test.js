const deployService = require('../../src/services/deployService.js');
const plateauService = require('../../src/services/plateauService.js');
const deployModel = require('../../src/models/deployModel.js');

jest.mock('../../src/services/plateauService.js');
jest.mock('../../src/models/deployModel.js');

describe('deployService', () => {
  describe('deployRover', () => {
    const mockPlateau = { id: '1', width: 10, height: 10 };
    const mockDeployData = { plateauId: '1', roverId: '101', command: 'MOVE' };
    const mockRoverStartingPosition = {
      name: 'Rover1',
      width: 5,
      height: 5,
      direction: 'N',
    };
    const mockDeployedRover = {
      id: '101',
      plateauId: '1',
      name: 'Rover1',
      currentHeight: 5,
      currentWidth: 5,
      direction: 'N',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should deploy a rover successfully', async () => {
      plateauService.getPlateau.mockResolvedValue(mockPlateau);
      deployModel.deployRover.mockResolvedValue({ success: true });

      const result = await deployService.deployRover(mockDeployData, mockRoverStartingPosition);
      
      expect(plateauService.getPlateau).toHaveBeenCalledWith(mockDeployData.plateauId);
      expect(deployModel.deployRover).toHaveBeenCalledWith(
        mockDeployData,
        mockDeployedRover
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw an error if the rover is out of bounds (width less than 0)', async () => {
      const invalidPosition = { ...mockRoverStartingPosition, width: -1 };

      plateauService.getPlateau.mockResolvedValue(mockPlateau);

      await expect(deployService.deployRover(mockDeployData, invalidPosition)).rejects.toThrow(
        'Rover out of bounds width cannot be less then 0'
      );
      expect(deployModel.deployRover).not.toHaveBeenCalled();
    });

    it('should throw an error if the rover is out of bounds (height less than 0)', async () => {
      const invalidPosition = { ...mockRoverStartingPosition, height: -1 };

      plateauService.getPlateau.mockResolvedValue(mockPlateau);

      await expect(deployService.deployRover(mockDeployData, invalidPosition)).rejects.toThrow(
        'Rover out of bounds height cannot be less then 0'
      );
      expect(deployModel.deployRover).not.toHaveBeenCalled();
    });

    it('should throw an error if the rover direction is missing', async () => {
      const invalidPosition = { ...mockRoverStartingPosition, direction: null };

      plateauService.getPlateau.mockResolvedValue(mockPlateau);

      await expect(deployService.deployRover(mockDeployData, invalidPosition)).rejects.toThrow(
        'Rover must have a direction to start moving'
      );
      expect(deployModel.deployRover).not.toHaveBeenCalled();
    });

    it('should throw an error if the rover is out of bounds (width exceeds plateau width)', async () => {
      const invalidPosition = { ...mockRoverStartingPosition, width: 15 };

      plateauService.getPlateau.mockResolvedValue(mockPlateau);

      await expect(deployService.deployRover(mockDeployData, invalidPosition)).rejects.toThrow(
        `Rover out of bounds width cannot be more then ${mockPlateau.width}`
      );
      expect(deployModel.deployRover).not.toHaveBeenCalled();
    });

    it('should throw an error if the rover is out of bounds (height exceeds plateau height)', async () => {
      const invalidPosition = { ...mockRoverStartingPosition, height: 15 };

      plateauService.getPlateau.mockResolvedValue(mockPlateau);

      await expect(deployService.deployRover(mockDeployData, invalidPosition)).rejects.toThrow(
        `Rover out of bounds height cannot be more then ${mockPlateau.height}`
      );
      expect(deployModel.deployRover).not.toHaveBeenCalled();
    });

    it('should throw an error if plateauService.getPlateau fails', async () => {
      plateauService.getPlateau.mockRejectedValue(new Error('Plateau not found'));

      await expect(deployService.deployRover(mockDeployData, mockRoverStartingPosition)).rejects.toThrow(
        'Error fetching deploy: Plateau not found'
      );
      expect(deployModel.deployRover).not.toHaveBeenCalled();
    });

    it('should throw an error if deployModel.deployRover fails', async () => {
      plateauService.getPlateau.mockResolvedValue(mockPlateau);
      deployModel.deployRover.mockRejectedValue(new Error('Database error'));

      await expect(deployService.deployRover(mockDeployData, mockRoverStartingPosition)).rejects.toThrow(
        'Error fetching deploy: Database error'
      );
    });
  });
});