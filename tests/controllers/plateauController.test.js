const Fastify = require('fastify');
const plateauRoutes = require('../../src/routes/plateauRoutes');
const plateauService = require('../../src/services/plateauService');

jest.mock('../../src/services/plateauService');

describe('Plateau Routes', () => {
  let fastify;

  beforeAll(() => {
    fastify = Fastify();
    fastify.register(plateauRoutes);
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should return a list of plateaus', async () => {
    const plateausList = [
      { id: 1, name: 'Olympus Mons', height: 22, width: 10 },
      { id: 2, name: 'Valles Marineris', height: 30, width: 15 },
    ];

    plateauService.getPlateaus.mockResolvedValue(plateausList);

    const response = await fastify.inject({
      method: 'GET',
      url: '/api/plateaus',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(plateausList);
  });

  it('should return a specific plateau by id', async () => {
    const plateau = { id: 1, name: 'Olympus Mons', height: 22, width: 10 };

    plateauService.getPlateau.mockResolvedValue(plateau);

    const response = await fastify.inject({
      method: 'GET',
      url: '/api/plateaus/1',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(plateau);
  });

  it('should return 400 if an invalid ID is provided for a specific plateau', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/plateaus/abc', // Invalid ID (non-numeric)
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Invalid ID. Must be a positive integer.' });
  });

  it('should create a new plateau and return 201', async () => {
    const newPlateauData = { name: 'Elysium Planitia', height: 20, width: 15 };
    const expectedPlateau = { id: 3, name: 'Elysium Planitia', height: 20, width: 15 };

    plateauService.createPlateau.mockResolvedValue(expectedPlateau);

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateaus',
      payload: newPlateauData,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual(expectedPlateau);
  });

  it('should return 400 if name is missing when creating a new plateau', async () => {
    const newPlateauData = { height: 20, width: 15 };

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateaus',
      payload: newPlateauData,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Name is required and must be a non-empty string.' });
  });

  it('should return 400 if height is invalid when creating a new plateau', async () => {
    const newPlateauData = { name: 'Elysium Planitia', height: -5, width: 15 };

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateaus',
      payload: newPlateauData,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Height must be a positive number!' });
  });

  it('should return 400 if width is invalid when creating a new plateau', async () => {
    const newPlateauData = { name: 'Elysium Planitia', height: 20, width: -10 };

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateaus',
      payload: newPlateauData,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Width must be a positive number!' });
  });

  it('should update an existing plateau and return 201', async () => {
    const updatedPlateauData = { name: 'Elysium Planitia', height: 25, width: 20 };
    const updatedPlateau = { id: 3, name: 'Elysium Planitia', height: 25, width: 20 };

    plateauService.updatePlateau.mockResolvedValue(updatedPlateau);

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateaus/3',
      payload: updatedPlateauData,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual(updatedPlateau);
  });

  it('should return 400 if invalid data is provided when updating a plateau', async () => {
    const updatedPlateauData = { name: '', height: 25, width: 20 };

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateaus/3',
      payload: updatedPlateauData,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Name is required and must be a non-empty string.' });
  });

  it('should delete a plateau and return 200', async () => {
    plateauService.deletePlateau.mockResolvedValue(1);

    const response = await fastify.inject({
      method: 'DELETE',
      url: '/api/plateaus/3',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Plateau deleted successfully' });
  });

  it('should return 404 if plateau not found for deletion', async () => {
    plateauService.deletePlateau.mockResolvedValue(0);

    const response = await fastify.inject({
      method: 'DELETE',
      url: '/api/plateaus/999',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'Plateau not found' });
  });

  it('should return 500 if there is an error in the service layer during deletion', async () => {
    plateauService.deletePlateau.mockRejectedValue(new Error('Service error'));

    const response = await fastify.inject({
      method: 'DELETE',
      url: '/api/plateaus/3',
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: 'Service error' });
  });
});