/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('plateaus').del()
  await knex('plateaus').insert([
    {name: 'Acidalia Planitia', width: 34, height: 10 },
    {name: 'Amazonis Planitia', width: 10, height: 28 },
    {name: 'Arcadia Planitia', width: 19, height: 10 },
    {name: 'Argyre Planitia', width: 10, height: 9 },
    {name: 'Chryse Planitia', width: 15, height: 10 },
    {name: 'Elysium Planitia', width: 10, height: 30 },
    {name: 'Eridania Planitia', width: 11, height: 10 },
    {name: 'Hellas Planitia', width: 10, height: 23 },
    {name: 'Isidis Planitia', width: 12, height: 10 },
    {name: 'Utopia Planitia', width: 10, height: 36 },
  ]);
};
