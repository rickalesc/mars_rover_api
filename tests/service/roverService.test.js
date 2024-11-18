const roverService = require('../../src/services/roverService');
const roverModel = require('../../src/models/roverModel');
const plateauService = require('../../src/services/plateauService');

jest.mock('../../src/models/roverModel');
jest.mock('../../src/services/plateauService');

describe('Rover Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of rovers', async () => {
        const roversList = [
            { id: 1, name: 'Curiosity', plateauId: 1 },
            { id: 2, name: 'Perseverance', plateauId: null }
        ];

        roverModel.getAllRovers.mockResolvedValue(roversList);
        plateauService.getPlateau.mockResolvedValue({ name: 'Plateau' });

        const rovers = await roverService.getRovers();
        expect(rovers).toEqual([
            { id: 1, name: 'Curiosity', plateauId: 1, status: 'Deployed at Plateau' },
            { id: 2, name: 'Perseverance', plateauId: null, status: 'At Base' }
        ]);
    });

    it('should return a specific rover by id', async () => {
        const rover = { id: 1, name: 'Curiosity', plateauId: 1 };
        roverModel.getRoverById.mockResolvedValue(rover);
        plateauService.getPlateau.mockResolvedValue({ name: 'Plateau' });

        const result = await roverService.getRover(1);
        expect(result).toEqual({ id: 1, name: 'Curiosity', plateauId: 1});
    });

    it('should throw 404 error if rover not found by id', async () => {
        roverModel.getRoverById.mockResolvedValue(null);

        try {
            await roverService.getRover(999);
        } catch (err) {
            expect(err.status).toBe(404);
            expect(err.message).toBe('Rover not found');
        }
    });

    it('should create a new rover', async () => {
        const newRoverData = { name: 'Opportunity', plateauId: null };
        const createdRover = { id: 3, name: 'Opportunity', plateauId: null, status: 'At Base' };

        roverModel.createRover.mockResolvedValue([createdRover]);

        const result = await roverService.createRover(newRoverData);
        expect(result).toEqual(createdRover);
    });

    it('should update an existing rover', async () => {
        const updatedRoverData = { id: 3, name: 'Opportunity', plateauId: 1, currentHeight: 100, currentWidth: 200, direction: 'N' };
        const updatedRover = { id: 3, name: 'Opportunity', plateauId: 1, status: 'Deployed at Plateau' };

        roverModel.updateRover.mockResolvedValue([updatedRover]);
        plateauService.getPlateau.mockResolvedValue({ name: 'Plateau' });

        const result = await roverService.updateRover(updatedRoverData);
        expect(result).toEqual(updatedRover);
    });

    it('should delete a rover', async () => {
        roverModel.deleteRover.mockResolvedValue(1); // 1 indicates success

        const result = await roverService.deleteRover(3);
        expect(result).toBe(1); // We expect the deletion result to be 1 (success)
    });

    it('should throw 500 error when failing to delete a rover', async () => {
        roverModel.deleteRover.mockResolvedValue(0); // 0 indicates no deletion occurred

        try {
            await roverService.deleteRover(999); // Try deleting a non-existent rover
        } catch (err) {
            expect(err.status).toBe(500);
            expect(err.message).toBe('Could not delete rover');
        }
    });
});