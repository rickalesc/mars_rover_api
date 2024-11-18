const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  development :{
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      tableName: 'knex_rover_migrations',
      directory: '../database/migrations'
    },
    seeds: {
      directory: '../database/seeds'
    }
  },

  test: {
    client: 'pg',
    connection: {
      host: process.env.TEST_DB_HOST,
      user: process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
    },
    migrations: {
      tableName: 'knex_rover_migrations',
      directory: '../database/migrations',
    },
    seeds: {
      directory: '../database/seeds',
    },
  },
};