/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('plateaus', function(table) {
       table.increments('id').primary();        
       table.integer('height').notNullable();
       table.integer('width').notNullable();
       table.string('name', 100).notNullable();
       table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
   return knex.schema.dropTableIfExists('plateaus');
};