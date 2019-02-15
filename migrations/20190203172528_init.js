
exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('name').unique().notNullable();
    table.string('password', 128).notNullable();
    table.string('salt', 64).notNullable();
    table.datetime('createdAt').defaultTo(knex.fn.now());
  }),

  knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary().notNullable();
    table.uuid('userId');
    table.text('content');
    table.datetime('createdAt').defaultTo(knex.fn.now());
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('users'),
  knex.schema.dropTable('messages'),
]);
