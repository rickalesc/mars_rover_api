const knex = require('knex');
require('dotenv').config();


const checkDbConnection = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
});

async function createDatabaseIfNotExist() {
    try {
        const dbName = process.env.DB_NAME;      
        const res = await checkDbConnection.raw('SELECT 1 FROM pg_database WHERE datname = ?', [dbName]);

        if (res.rows.length === 0) {
            console.log(`Database "${dbName}" does not exist. Creating it...`);
            await checkDbConnection.raw(`CREATE DATABASE "${dbName}"`);
            console.log(`Database "${dbName}" created successfully.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

createDatabaseIfNotExist();