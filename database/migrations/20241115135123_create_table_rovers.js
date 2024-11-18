/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('rovers', function(table) {
        table.increments('id').primary();        
        table.string('name', 100).notNullable();
        table.integer('plateauId').nullable().references('id').inTable('plateaus').onDelete('SET NULL');
        table.integer('currentHeight').nullable();
        table.integer('currentWidth').nullable();
        table.string('direction', 1).nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
     });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('rovers');
};