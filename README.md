-- STEPS TO ADD A DATABASE WITH TABLES TO HEROKU

> mkdir q2tutorial
> cd q2tutorial
> touch .env

> express --hbs --git
> npm install

- Go to github and create a repo and copy the address

> git init
> git add .
> git commit -m "first commit"
> git remote add origin "blah blah blah"
> git push origin master

> heroku create [name of application]  
> npm install knex --save
> npm install pg -S
> knex init

> git add .
> git commit -m "added knexfile.js and package.json"
> git push

> createdb [name of database] // we will call it 'q2tutorialdb' for the rest of the project
> atom .

- add .env inside the .gitignore file

- Change client and connection in the knexfile.js
      development: {
        client: 'postgres',
        connection: {
          database: name of database created earlier wrapped in quotes // ex = : 'q2tutorialdb'
        }
      },

- Remove the staging object from the knexfile.js

> knex migrate:make [name of table] // we will call it todos

- Now from the migrations folder find the migration file that you just made
- Add the table info (example below)

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

> knex migrate:latest

- Check to see if the table is there
> psql [name of database]
 =# TABLE [name of table];

- Get out of psql (type : '\q' + hit enter)
> git add .
> git commit -m "first migration"

- Add the data to your table
> knex seed:make [name of data]

- Go to the seed folder and click on the file that you just created
- Change all of the 'table_name' to the name of your table
- Insert seed data in the object to match with the columns that you made in the table
ex :
knex('todos').insert({id: 1, name: "dummy data1", description: "just add it in"}),
knex('todos').insert({id: 2, name: "dummy data2", description: "just add it in"}),
knex('todos').insert({id: 3, name: "dummy data3", description: "just add it in"})


> knex seed:run
> psql [name of database]
 =# TABLE [name of table]

- create a database on heroku
- heroku docs (https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database)

> heroku addons:create heroku-postgresql:hobby-dev
> heroku config

- Copy the entire DATABASE_URL location
- Paste it into the .env file
- Change the colon after DATABASE_URL to an equal sign
- At the end of the address add "?ssl=true"
example : DATABASE_URL = postgres://blahblahblah:lfQwRfNea3qGrwOxJTYYtdWGkd@ec2-54-235-183-28.compute-1.amazonaws.com:5432/d8pr5444mns72?ssl=true
- make sure it is all on one line (sometimes it adds spaces in the address)

- Go to the knexfile.js file
- set production.connection: process.env.DATABASE_URL,

> npm install dotenv --save

- Add "var dotenv = require('dotenv').config()" to the top of the knexfile.js file

> knex migrate:latest --env production
> knex seed:run --env production

> git add .
> git commit -m "added database to heroku"
> git push origin master

> git push heroku master
> heroku open

- from the command line you can check to see if the tables are added to your heroku backend
> heroku pg:psql
 => \d // tells you what tables are on the database
 => SELECT * from [name of table]

 - So now our database is launched on heroku and our table called "todos" is on there and it contains our seed data.

 - Create a new directory and add a knex config file to the directory
 > mkdir db
 > touch db/knex_config.js

 - Now we need to add a few things to that knex_config.js file

'use strict'
 const knex = require('knex')
 const config = require('../knexfile.js');
 const env = process.env.NODE_ENV || 'development'

 let pg = knex(config[env]);

 module.exports = pg

 //this file tells knex which database to connect to

 - On the routes/index.js file lets bring in pg

  const pg = require('../db/knex_config.js')

  - at the top of the routes/index.js file let's add 'use strict' to make heroku happy

  - now we want to tell knex what to populate when we hit certain routes -> so in the same index.js file let's add the following :

  router.get('/', function(req, res, next) {
    pg('todos').select()
      .then((rows)=>{
        res.render('index', {items: rows})
    })
      .catch((err)=>{
        console.error("Error getting from the database");
        next(err)
      })
  });

  -- Now lets make it so that the data from the db shows up on our browser. Lets also make a form to add todos. In the /views/index.js file add the following:

  <h1>MY TODO APP</h1>

  <ul>
  {{#each items}}
  <li>{{this.name}}</li>
  <p>{{this.description}}</p>

  {{/each}}
  </ul>
  <h3> Create a todo item </h3>
  <section>
    <form class='add-item' action='/api/v1/items' method='post'>
      <div>
        <label for='item-name'> What do you want to do? </label>
        <input type='text' name='name' value=''></input>
      </div>
      <div>
        <label for='item-description'>Tell me more </label>
        <textarea name='description' rows='8' cols= '40'></textarea>
      </div>
      <div>
        <input type='submit'>
      </div>
    </form>
  </section>

  -- in app.js add 'use strict' at the top
  -- now we need to create a folder for the api called "api" & make a file called 'index.js'
  -- in app.js add api information

  const api = require('./api/index.js');

  app.use('/api', api)

  -- in index.js add the api data
  'use strict'

  const express = require('express');
  let router = express.Router();
  const pg = require('../db/knex_config.js');

  router.post('/v1/items',(req, res, next) => {
    //console.log(pg)
    pg('todos').insert(req.body)
    .then(() =>{
      res.redirect('/')
    })
    .catch((err)=>{
      console.log('there was an error')
      next(err)
    })
  });

  router.get('/v1/items/delete/:id', (req, res, next) => {
    // console.log("the id is: ", req.params.id);
    // res.json(req.params)
    pg('todos').where('id', req.params.id).del()
    .then((something)=>{
      console.log(something)
    res.redirect('/')
  })
    .catch((err) => {
    console.error("error deleting from db");
    next(err);
    });
  });

  module.exports = router;

  -- in the views/index.hbs after the following line of code
  <ul>
  {{#each items}}
  <li>{{this.name}}

  -- add this code - > 

  <span class='completed'><a href="/api/v1/items/delete/{{this.id}}">X</a></span>
