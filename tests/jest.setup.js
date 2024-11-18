const knex = require('knex');
const knexConfig = require('../config/knexfile.js');

global.knex = knex(knexConfig.test);

beforeAll(async () => {
  //await global.knex.migrate.latest();
  //await global.knex.seed.run();
});

afterAll(async () => {
  await global.knex.destroy();
});