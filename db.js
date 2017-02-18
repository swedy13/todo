// Dependencies
var Sequelize = require('sequelize');

// Imports
var Todos = __dirname + '/models/todos.js';

// Variables
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/dev-todo.sqlite'
});
var db = {};


db.todo = sequelize.import(Todos);
db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
