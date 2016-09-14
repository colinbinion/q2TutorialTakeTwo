// Update with your config settings.

module.exports = {

  development: {
    client: 'postgres',
    connection: {
      database: 'q2-tutorial-take-two'
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
