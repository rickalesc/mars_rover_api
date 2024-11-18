const fastify = require('fastify');
const commandRoutes = require('../../src/routes/commandRoutes.js');
const commandService = require('../../src/services/commandService.js');

jest.mock('../../src/services/commandService.js');

let app;

beforeAll(() => {
  app = fastify();
  app.register(commandRoutes);
});

afterAll(() => {
  app.close();
});

describe('Command Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute a rover command successfully', async () => {
    const mockCommand = { status: 'success', message: 'Command executed' };
    commandService.commandRover.mockResolvedValue(mockCommand);

    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/command',
      payload: { command: 'move forward' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockCommand);
    expect(commandService.commandRover).toHaveBeenCalledWith({ plateauId: '1', roverId: '101', command: 'move forward' });
  });

  it('should return a 500 if service throws an error', async () => {
    const mockError = new Error('Service error');
    commandService.commandRover.mockRejectedValue(mockError);

    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/command',
      payload: { command: 'move forward' },
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: 'Service error' });
  });

  it('should return a 400 if the plateauId or roverId is invalid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/abc/rover/101/command',
      payload: { command: 'move forward' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Invalid ID. Must be a positive integer.' });
  });

  it('should return a 400 if the command is missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/command',
      payload: {}, 
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Command is required and must be a non-empty string.' });
  });

  it('should return a 400 if the command is an empty string', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/command',
      payload: { command: '' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Command is required and must be a non-empty string.' });
  });

  it('should return a custom error status and message if the service throws a custom error', async () => {
    const mockError = new Error('Validation failed');
    mockError.status = 422;
    commandService.commandRover.mockRejectedValue(mockError);

    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/command',
      payload: { command: 'MMRML' },
    });

    expect(response.statusCode).toBe(422);
    expect(response.json()).toEqual({ error: 'Validation failed' });
  });

  it('should return a 404 for invalid routes', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/invalid-route',
      payload: { command: 'MMRML' },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should handle excessively large command strings gracefully', async () => {
    const longCommand = 'M'.repeat(10000);
    commandService.commandRover.mockResolvedValue({ status: 'success' });

    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/command',
      payload: { command: longCommand },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'success' });
  });
});