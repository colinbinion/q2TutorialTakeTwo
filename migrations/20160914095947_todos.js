exports.up = function(knex, Promise) {
  return knex.schema.createTable('todos', function(table){
    table.increments();
    table.string('name');
    table.string('description');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('todos')
};
