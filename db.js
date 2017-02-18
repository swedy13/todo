var Sequelize = require('sequelize');
var Todos = __dirname + '/models/todos.js';

var env = process.env.NODE_ENV || 'development';
var sequelize;
if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
}
else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-todo.sqlite'
    });
}
var db = {};


db.todo = sequelize.import(Todos);
db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
