const fastify = require('fastify');
const commandRoutes = require('../../src/routes/commandRoutes.js');
const commandService = require('../../src/services/commandService.js');

jest.mock('../../src/services/commandService.js');

describe('Command Routes', () => {
  let app;

  beforeEach(async () => {
    app = fastify();
    app.register(commandRoutes);
    await app.ready();
  });

  afterEach(() => {
    app.close();
    jest.clearAllMocks();
  });

  it('should execute a rover command successfully', async () => {
    const mockCommandResponse = { status: 'success', message: 'Command executed' };
    commandService.commandRover.mockResolvedValue(mockCommandResponse);

    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/command',
      payload: { command: 'MMRML' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockCommandResponse);
    expect(commandService.commandRover).toHaveBeenCalledWith({
      plateauId: '1',
      roverId: '101',
      command: 'MMRML',
    });
  });

  it('should return a 400 for missing or invalid payload', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/command',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('error');
    expect(commandService.commandRover).not.toHaveBeenCalled();
  });

  it('should return a 500 if the service throws an error', async () => {
    commandService.commandRover.mockRejectedValue(new Error('Service error'));

    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/1/rover/101/command',
      payload: { command: 'MMRML' },
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: 'Service error' });
    expect(commandService.commandRover).toHaveBeenCalledWith({
      plateauId: '1',
      roverId: '101',
      command: 'MMRML',
    });
  });

  it('should return a 404 if route parameters are invalid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/plateau/invalid/rover/101/command', // Invalid plateauId
      payload: { command: 'MMRML' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('error');
    expect(commandService.commandRover).not.toHaveBeenCalled();
  });
});