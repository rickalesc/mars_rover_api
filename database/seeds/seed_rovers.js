/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('rovers').del()
  await knex('rovers').insert([
    {name: 'Sojourner'},
    {name: 'Spirit'},
    {name: 'Opportunity'},
    {name: 'Curiosity'},
    {name: 'Perseverance'}
  ]);
};
