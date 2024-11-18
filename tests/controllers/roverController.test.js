/*const Fastify = require('fastify');
const roverRoutes = require('../../src/routes/roverRoutes');

jest.mock('../../src/services/roverService');

describe('Rover Routes', () => {
  let fastify;

  beforeAll(() => {
    fastify = Fastify();
    fastify.register(roverRoutes);
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should return a list of rovers', async () => {
    const roversList = [
      { id: 1, name: 'Curiosity', status: 'active' },
      { id: 2, name: 'Perseverance', status: 'active' },
    ];
    require('../../src/services/roverService').getRovers.mockResolvedValue(roversList);
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/rovers',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(roversList);
  });

  it('should return a specific rover by id', async () => {
    const rover = { id: 1, name: 'Curiosity', status: 'active' };
    require('../../src/services/roverService').getRover.mockResolvedValue(rover);
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/rovers/1',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(rover);
  });

  it('should create a new rover and return 201', async () => {
    const newRoverData = { name: 'Opportunity', status: 'inactive' };
    const expectedRover = { id: 3, name: 'Opportunity', status: 'inactive' };
    require('../../src/services/roverService').createRover.mockResolvedValue(expectedRover);
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/rovers',
      payload: newRoverData,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual(expectedRover);
  });

  it('should update an existing rover and return 201', async () => {
    const updatedRoverData = { name: 'Opportunity', status: 'active' };
    const updatedRover = { id: 3, name: 'Opportunity', status: 'active' };
    require('../../src/services/roverService').updateRover.mockResolvedValue(updatedRover);
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/rovers/3',
      payload: updatedRoverData,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual(updatedRover);
  });

  it('should delete a rover and return 200', async () => {
    require('../../src/services/roverService').deleteRover.mockResolvedValue(1);
    const response = await fastify.inject({
      method: 'DELETE',
      url: '/api/rovers/3',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Rover deleted successfully' });
  });

  it('should return 404 if rover not found for deletion', async () => {
    require('../../src/services/roverService').deleteRover.mockResolvedValue(0);
    const response = await fastify.inject({
      method: 'DELETE',
      url: '/api/rovers/999',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'Rover not found' });
  });
}); */




const Fastify = require('fastify');
const roverRoutes = require('../../src/routes/roverRoutes');
const roverService = require('../../src/services/roverService');

// Mock the roverService methods
jest.mock('../../src/services/roverService');

describe('Rover Routes', () => {
  let fastify;

  beforeAll(() => {
    fastify = Fastify();
    fastify.register(roverRoutes);
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should return a list of rovers', async () => {
    const roversList = [
      { id: 1, name: 'Curiosity', status: 'active' },
      { id: 2, name: 'Perseverance', status: 'active' },
    ];
    roverService.getRovers.mockResolvedValue(roversList);
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/rovers',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(roversList);
  });

  it('should return a specific rover by id', async () => {
    const rover = { id: 1, name: 'Curiosity', status: 'active' };
    roverService.getRover.mockResolvedValue(rover);
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/rovers/1',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(rover);
  });

  it('should return 400 if the rover id is invalid', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/rovers/abc',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Invalid ID. Must be a positive integer.' });
  });

  it('should create a new rover and return 201', async () => {
    const newRoverData = { name: 'Opportunity', status: 'inactive' };
    const expectedRover = { id: 3, name: 'Opportunity', status: 'inactive' };
    roverService.createRover.mockResolvedValue(expectedRover);
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/rovers',
      payload: newRoverData,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual(expectedRover);
  });

  it('should return 400 if name is invalid during rover creation', async () => {
    const invalidRoverData = { name: '', status: 'inactive' };
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/rovers',
      payload: invalidRoverData,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Name is required and must be a non-empty string.' });
  });

  it('should update an existing rover and return 201', async () => {
    const updatedRoverData = { name: 'Opportunity', status: 'active' };
    const updatedRover = { id: 3, name: 'Opportunity', status: 'active' };
    roverService.updateRover.mockResolvedValue(updatedRover);
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/rovers/3',
      payload: updatedRoverData,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual(updatedRover);
  });

  it('should return 400 if name is invalid during rover update', async () => {
    const invalidRoverData = { name: '', status: 'active' };
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/rovers/3',
      payload: invalidRoverData,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Name is required and must be a non-empty string.' });
  });

  it('should delete a rover and return 200', async () => {
    roverService.deleteRover.mockResolvedValue(1);
    const response = await fastify.inject({
      method: 'DELETE',
      url: '/api/rovers/3',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Rover deleted successfully' });
  });

  it('should return 404 if rover not found for deletion', async () => {
    roverService.deleteRover.mockResolvedValue(0);
    const response = await fastify.inject({
      method: 'DELETE',
      url: '/api/rovers/999',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'Rover not found' });
  });

  it('should return 404 if rover not found during get by id', async () => {
    roverService.getRover.mockResolvedValue(null);
    
    const response = await fastify.inject({
        method: 'GET',
        url: '/api/rovers/999',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'Rover not found' });
});
});