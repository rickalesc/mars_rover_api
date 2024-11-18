const knexConfig = require('../../config/knexfile.js');
const knex = require('knex')(knexConfig.development);

const getAllRovers = () => {
    return knex('rovers').select('*');
};

const getRoverById = (id) => {
    return knex('rovers').where('id', id).first();
};

const createRover = (rover) => {
    return knex('rovers').insert(rover).returning('*');
};

const updateRover = (id, rover) => {
    return knex('rovers').where({ id }).update(rover).returning('*');
};

const deleteRover = (id) => {
    return knex('rovers').where({id}).del();
};

module.exports = {
    getAllRovers,
    getRoverById,
    createRover,
    updateRover,
    deleteRover
};