const knexConfig = require('../../config/knexfile.js');
const knex = require('knex')(knexConfig.development);

const deployRover = (command, rover) => {
    return knex.transaction(async (trx) => {
        try{
            const [newCommand] = await trx('commands').insert(command).returning('*');
            await trx('rovers').where({ id : command.roverId }).update(rover);
            return newCommand;
        } catch(err){
            throw err;
        }
    });
};

module.exports = {
    deployRover
};