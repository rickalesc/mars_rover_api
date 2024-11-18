const fastify = require('fastify')();
const deployRoutes = require('../../src/routes/deployRoutes.js');
const deployService = require('../../src/services/deployService.js');

jest.mock('../../src/services/deployService.js');

beforeAll(async () => {
  fastify.register(deployRoutes);
  await fastify.ready();
});

afterAll(async () => {
  await fastify.close();
});

describe('Deploy Routes', () => {
  it('should deploy the rover successfully', async () => {
    const mockDeployResponse = {
      message: 'Rover deployed successfully',
      plateauId: '1',
      roverId: '101',
    };
    deployService.deployRover.mockResolvedValue(mockDeployResponse);

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/deploy',
      payload: {
        height: 5,
        width: 5,
        direction: 'N',
        command: 'MOVE',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockDeployResponse);
    expect(deployService.deployRover).toHaveBeenCalledWith(
      { plateauId: '1', roverId: '101', command: 'MOVE' },
      { direction: 'N', height: 5, width: 5 }
    );
  });

  it('should return 500 when deployment fails', async () => {
    const mockError = new Error('Deployment failed');
    deployService.deployRover.mockRejectedValue(mockError);

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/deploy',
      payload: {
        height: 5,
        width: 5,
        direction: 'N',
        command: 'MOVE',
      },
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: mockError.message });
  });

  it('should return 400 when required fields are missing', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/deploy',
      payload: {
        height: 5,
        width: 4,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('error', 'Direction is required and must be a non-empty string.');
  });

  it('should return 400 when plateauId or roverId is invalid', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateau/invalid/rover/101/deploy',
      payload: {
        height: 5,
        width: 5,
        direction: 'N',
        command: 'MOVE',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('error', 'Invalid ID. Must be a positive integer.');
  });

  it('should return 400 when height or width is invalid', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/deploy',
      payload: {
        height: -1,
        width: 0,
        direction: 'N',
        command: 'MOVE',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('error', 'Height must be a positive number!');
  });

  it('should return 400 when direction or command is invalid', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/deploy',
      payload: {
        height: 5,
        width: 5,
        direction: '',
        command: null,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('error', 'Direction is required and must be a non-empty string.');
  });

  it('should deploy rover with large dimensions successfully', async () => {
    const mockDeployResponse = {
      message: 'Rover deployed successfully',
      plateauId: '1',
      roverId: '101',
    };
    deployService.deployRover.mockResolvedValue(mockDeployResponse);

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/deploy',
      payload: {
        height: 100000,
        width: 100000,
        direction: 'N',
        command: 'MOVE',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockDeployResponse);
  });

  it('should return 500 when service throws an error', async () => {
    const mockError = new Error('Database connection failed');
    deployService.deployRover.mockRejectedValue(mockError);

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/deploy',
      payload: {
        height: 5,
        width: 5,
        direction: 'N',
        command: 'MOVE',
      },
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toHaveProperty('error', 'Database connection failed');
  });

  it('should return a well-structured successful response', async () => {
    const mockDeployResponse = {
      message: 'Rover deployed successfully',
      plateauId: '1',
      roverId: '101',
    };
    deployService.deployRover.mockResolvedValue(mockDeployResponse);

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/deploy',
      payload: {
        height: 5,
        width: 5,
        direction: 'N',
        command: 'MOVE',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      message: expect.any(String),
      plateauId: expect.any(String),
      roverId: expect.any(String),
    });
  });
});