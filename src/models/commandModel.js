const knexConfig = require('../../config/knexfile.js');
const knex = require('knex')(knexConfig.development);

const commandRover = (command, rover) => {
    return knex.transaction(async (trx) => {
        try{
            const [newCommand] = await trx('commands').insert(command).returning('*');
            await trx('rovers').where({ id : rover.id }).update(rover);
            return newCommand;
        } catch(err){
            throw err;
        }
    });
};

module.exports = {
    commandRover
};