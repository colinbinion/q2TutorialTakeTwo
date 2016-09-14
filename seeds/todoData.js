
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('todos').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('todos').insert({id: 1, name: "dummy data1", description: "just add it in"}),
        knex('todos').insert({id: 2, name: "dummy data2", description: "just add it in"}),
        knex('todos').insert({id: 3, name: "dummy data3", description: "just add it in"})
      ]);
    });
};
