const Fastify = require('fastify');
const roverRoutes = require('../../src/routes/roverRoutes.js');
const roverService = require('../../src/services/roverService.js');

jest.mock('../../src/services/roverService.js');

describe('Rover Routes', () => {
  let fastify;

  beforeEach(async () => {
    fastify = Fastify();
    fastify.register(roverRoutes);
    await fastify.ready();
  });

  afterEach(async () => {
    await fastify.close();
  });

  it('Should return a list of rovers', async () => {
    const mockRovers = [
      { id: 1, name: 'Curiosity' },
      { id: 2, name: 'Opportunity' },
    ];
    roverService.getRovers.mockResolvedValue(mockRovers);
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/rovers',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockRovers);
  });

  it('Should return a specific rover by id', async () => {
    const mockRover = { id: 1, name: 'Curiosity' };
    const roverId = 1;
    roverService.getRover.mockResolvedValue(mockRover);
    const response = await fastify.inject({
      method: 'GET',
      url: `/api/rovers/${roverId}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockRover);
  });

  it('Should return 404 if rover not found in GET by id', async () => {
    const roverId = 999;
    roverService.getRover.mockResolvedValue(null); // Simulate not found
    const response = await fastify.inject({
      method: 'GET',
      url: `/api/rovers/${roverId}`,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'Rover not found' });
  });

  it('Should create a rover', async () => {
    const newRoverData = { name: 'Perseverance' };
    const newRover = { id: 3, name: 'Perseverance' };
    roverService.createRover.mockResolvedValue(newRover);
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/rovers',
      payload: newRoverData,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual(newRover);
  });

  it('Should return 400 for invalid rover data (e.g., missing name)', async () => {
    const invalidRoverData = {};
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/rovers',
      payload: invalidRoverData,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Name is required and must be a non-empty string.' });
  });

  it('Should update a rover', async () => {
    const updatedRoverData = { name: 'Spirit' };
    const updatedRover = { id: 1, name: 'Spirit' };
    const roverId = 1;
    roverService.updateRover.mockResolvedValue(updatedRover);
    const response = await fastify.inject({
      method: 'POST',
      url: `/api/rovers/${roverId}`,
      payload: updatedRoverData,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual(updatedRover);
  });

  it('Should return 400 for invalid update data', async () => {
    const updatedRoverData = {};
    const roverId = 1;
    const response = await fastify.inject({
      method: 'POST',
      url: `/api/rovers/${roverId}`,
      payload: updatedRoverData,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Name is required and must be a non-empty string.' });
  });

  it('Should delete a rover', async () => {
    const roverId = 1;
    roverService.deleteRover.mockResolvedValue(1);
    const response = await fastify.inject({
      method: 'DELETE',
      url: `/api/rovers/${roverId}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Rover deleted successfully' });
  });

  it('Should return 404 if rover not found in DELETE', async () => {
    const roverId = 999;
    roverService.deleteRover.mockResolvedValue(0);
    const response = await fastify.inject({
      method: 'DELETE',
      url: `/api/rovers/${roverId}`,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'Rover not found' });
  });

  it('Should return 500 for server errors in create', async () => {
    const newRoverData = { name: 'Perseverance' };
    roverService.createRover.mockRejectedValue(new Error('Database Error'));
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/rovers',
      payload: newRoverData,
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ "error": "Database Error" });
  });

  it('Should return 404 for unsupported methods (e.g., PUT on /api/rovers)', async () => {
    const response = await fastify.inject({
      method: 'PUT',
      url: '/api/rovers',
    });
    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'Not Found', message: 'Route PUT:/api/rovers not found', statusCode: 404 });
  });
});