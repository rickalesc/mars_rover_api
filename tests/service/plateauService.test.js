const plateauService = require('../../src/services/plateauService');
const plateauModel = require('../../src/models/plateauModel');

jest.mock('../../src/models/plateauModel');

describe('Plateau Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlateaus', () => {
    it('should return a list of plateaus', async () => {
      const mockPlateaus = [
        { id: '1', name: 'Plateau 1', height: 5, width: 5 },
        { id: '2', name: 'Plateau 2', height: 10, width: 10 }
      ];

      plateauModel.getAllPlateaus.mockResolvedValue(mockPlateaus);

      const result = await plateauService.getPlateaus();
      expect(result).toEqual(mockPlateaus);
      expect(plateauModel.getAllPlateaus).toHaveBeenCalled();
    });

    it('should throw an error if fetching plateaus fails', async () => {
      const errorMessage = 'Error fetching plateaus';
      plateauModel.getAllPlateaus.mockRejectedValue(new Error(errorMessage));

      await expect(plateauService.getPlateaus()).rejects.toThrowError(errorMessage);
    });
  });

  describe('getPlateau', () => {
    it('should return a specific plateau by ID', async () => {
      const mockPlateau = { id: '1', name: 'Plateau 1', height: 5, width: 5 };
      plateauModel.getPlateauById.mockResolvedValue(mockPlateau);

      const result = await plateauService.getPlateau('1');
      expect(result).toEqual(mockPlateau);
      expect(plateauModel.getPlateauById).toHaveBeenCalledWith('1');
    });

    it('should throw an error if plateau not found', async () => {
      const errorMessage = 'Plateau not found';
      plateauModel.getPlateauById.mockResolvedValue(null);

      await expect(plateauService.getPlateau('999')).rejects.toThrowError(errorMessage);
    });

    it('should throw an error if fetching plateau fails', async () => {
      const errorMessage = 'Error fetching plateau';
      plateauModel.getPlateauById.mockRejectedValue(new Error(errorMessage));

      await expect(plateauService.getPlateau('1')).rejects.toThrowError(errorMessage);
    });
  });

  describe('createPlateau', () => {
    it('should create a new plateau when valid data is provided', async () => {
      const newPlateauData = { name: 'New Plateau', height: 10, width: 10 };
      const createdPlateau = { id: '3', ...newPlateauData };

      plateauModel.createPlateau.mockResolvedValue([createdPlateau]);

      const result = await plateauService.createPlateau(newPlateauData);
      expect(result).toEqual(createdPlateau);
      expect(plateauModel.createPlateau).toHaveBeenCalledWith(newPlateauData);
    });

    it('should throw an error if validation fails', async () => {
      const invalidPlateauData = { name: 'Invalid Plateau', height: 60, width: 10 }; // Invalid height

      await expect(plateauService.createPlateau(invalidPlateauData)).rejects.toThrowError('Height value must be between 1 and 50');
    });

    it('should throw an error if creating plateau fails', async () => {
      const newPlateauData = { name: 'New Plateau', height: 10, width: 10 };
      plateauModel.createPlateau.mockRejectedValue(new Error('Error creating plateau'));

      await expect(plateauService.createPlateau(newPlateauData)).rejects.toThrowError('Error creating plateau');
    });
  });

  describe('updatePlateau', () => {
    it('should update an existing plateau', async () => {
      const updatedPlateauData = { id: '1', name: 'Updated Plateau', height: 15, width: 15 };
      const updatedPlateau = { id: '1', ...updatedPlateauData };

      plateauModel.updatePlateau.mockResolvedValue([updatedPlateau]);

      const result = await plateauService.updatePlateau(updatedPlateauData);
      expect(result).toEqual(updatedPlateau);
      expect(plateauModel.updatePlateau).toHaveBeenCalledWith('1', { width: 15, height: 15, name: 'Updated Plateau' });
    });

    it('should throw an error if validation fails', async () => {
      const invalidUpdatedPlateauData = { id: '1', name: 'Updated Plateau', height: 60, width: 10 }; // Invalid height

      await expect(plateauService.updatePlateau(invalidUpdatedPlateauData)).rejects.toThrowError('Height value must be between 1 and 50');
    });

    it('should throw an error if updating plateau fails', async () => {
      const updatedPlateauData = { id: '1', name: 'Updated Plateau', height: 15, width: 15 };
      plateauModel.updatePlateau.mockRejectedValue(new Error('Error updating plateau'));

      await expect(plateauService.updatePlateau(updatedPlateauData)).rejects.toThrowError('Error updating plateau');
    });
  });

  describe('deletePlateau', () => {
    it('should delete a plateau successfully', async () => {
      plateauModel.deletePlateau.mockResolvedValue(1); // Simulate successful deletion

      const result = await plateauService.deletePlateau({ id: '1' });
      expect(result).toBe(1);
      expect(plateauModel.deletePlateau).toHaveBeenCalledWith(1);
    });

    it('should throw an error if validation fails', async () => {
      await expect(plateauService.deletePlateau({ id: 'invalid' })).rejects.toThrowError('Invalid id, must be a number');
    });

    it('should throw an error if deleting plateau fails', async () => {
      plateauModel.deletePlateau.mockRejectedValue(new Error('Error deleting plateau'));

      await expect(plateauService.deletePlateau({ id: '1' })).rejects.toThrowError('Error deleting plateau');
    });
  });
});