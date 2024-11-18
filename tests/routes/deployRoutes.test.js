const fastify = require('fastify');
const deployRoutes = require('../../src/routes/deployRoutes.js');
const deployService = require('../../src/services/deployService.js');

jest.mock('../../src/services/deployService.js');

let app;

beforeAll(() => {
  app = fastify();
  app.register(deployRoutes);
});

afterAll(() => {
  app.close();
});

describe('Deploy Routes', () => {
  it('should deploy a rover successfully', async () => {
    const mockDeployResponse = { status: 'success', message: 'Rover deployed' };
    deployService.deployRover.mockResolvedValue(mockDeployResponse);

    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/deploy',
      payload: { direction: 'N', height: 5, width: 5, command: 'deploy' }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockDeployResponse);
    expect(deployService.deployRover).toHaveBeenCalledWith(
      { plateauId: '1', roverId: '101', command: 'deploy' },
      { direction: 'N', height: 5, width: 5 }
    );
  });

  it('should return a 400 if required parameters are missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/deploy',
      payload: { direction: 'N', height: 5 }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: "Width must be a positive number!" });
  });

  it('should return a 500 if service throws an error', async () => {
    const mockError = new Error('Service error');
    deployService.deployRover.mockRejectedValue(mockError);

    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/deploy',
      payload: { direction: 'N', height: 5, width: 5, command: 'deploy' }
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: 'Service error' });
  });

  it('should return a 400 for invalid plateauId or roverId', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/a/rover/b/deploy',
      payload: { direction: 'N', height: 5, width: 5, command: 'deploy' }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Invalid ID. Must be a positive integer.' });
  });
});