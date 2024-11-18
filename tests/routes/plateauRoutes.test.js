const fastify = require('fastify');
const plateauRoutes = require('../../src/routes/plateauRoutes.js');
const plateauService = require('../../src/services/plateauService.js');

jest.mock('../../src/services/plateauService.js');

let app;

beforeAll(() => {
  app = fastify();
  app.register(plateauRoutes);
});

afterAll(() => {
  app.close();
});

describe('Plateau Routes', () => {
  it('should return a list of plateaus', async () => {
    const mockPlateaus = [
      { id: '1', name: 'Plateau 1', height: 5, width: 5 },
      { id: '2', name: 'Plateau 2', height: 10, width: 10 }
    ];

    plateauService.getPlateaus.mockResolvedValue(mockPlateaus);

    const response = await app.inject({
      method: 'GET',
      url: '/api/plateaus'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockPlateaus);
    expect(plateauService.getPlateaus).toHaveBeenCalled();
  });

  it('should return a specific plateau by ID', async () => {
    const mockPlateau = { id: '1', name: 'Plateau 1', height: 5, width: 5 };

    plateauService.getPlateau.mockResolvedValue(mockPlateau);

    const response = await app.inject({
      method: 'GET',
      url: '/api/plateaus/1'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockPlateau);
    expect(plateauService.getPlateau).toHaveBeenCalledWith('1');
  });

  it('should create a new plateau', async () => {
    const newPlateau = { name: 'New Plateau', height: 10, width: 10 };
    const mockPlateau = { id: '3', ...newPlateau };

    plateauService.createPlateau.mockResolvedValue(mockPlateau); 

    const response = await app.inject({
      method: 'POST',
      url: '/api/plateaus',
      payload: newPlateau
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual(mockPlateau);
    expect(plateauService.createPlateau).toHaveBeenCalledWith(newPlateau);
  });

  it('should update an existing plateau', async () => {
    const updatedPlateau = { id: '1', name: 'Updated Plateau', height: 15, width: 15 };

    plateauService.updatePlateau.mockResolvedValue(updatedPlateau);

    const response = await app.inject({
      method: 'POST',
      url: '/api/plateaus/1',
      payload: updatedPlateau
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual(updatedPlateau);
    expect(plateauService.updatePlateau).toHaveBeenCalledWith(updatedPlateau);
  });

  it('should delete an existing plateau', async () => {
    plateauService.deletePlateau.mockResolvedValue(1);

    const response = await app.inject({
      method: 'DELETE',
      url: '/api/plateaus/1'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Plateau deleted successfully' });
    expect(plateauService.deletePlateau).toHaveBeenCalledWith({ id: '1' });
  });

  it('should return a 404 if plateau to delete does not exist', async () => {
    plateauService.deletePlateau.mockResolvedValue(0);

    const response = await app.inject({
      method: 'DELETE',
      url: '/api/plateaus/99'
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'Plateau not found' });
  });
});