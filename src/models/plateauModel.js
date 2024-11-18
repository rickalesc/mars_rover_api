const knexConfig = require('../../config/knexfile.js');
const knex = require('knex')(knexConfig.development);

const getAllPlateaus = () => {
    return knex('plateaus').select('*');
};

const getPlateauById = (id) => {
    return knex('plateaus').where('id', id).first();
};

const createPlateau = (plateau) => {
    return knex('plateaus').insert(plateau).returning('*');
};

const updatePlateau = (id, plateau) => {
    return knex('plateaus').where({ id }).update(plateau).returning('*');
};

const deletePlateau = async (id) => {
    return knex('plateaus').where({ id }).del();
};

module.exports = {
    getAllPlateaus,
    getPlateauById,
    createPlateau,
    updatePlateau,
    deletePlateau
};