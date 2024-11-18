/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('commands', function(table) {
        table.increments('id').primary();        
        table.string('command', 100).notNullable();
        table.integer('plateauId').nullable().references('id').inTable('plateaus').onDelete('SET NULL');
        table.integer('roverId').nullable().references('id').inTable('rovers').onDelete('SET NULL');
        table.integer('initialHeight').nullable();
        table.integer('initialWidth').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
     });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('commands');
};
