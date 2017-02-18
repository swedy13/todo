// ---- DEPENDENCIES ---- //
var Sequelize = require('sequelize');


// ---- VARIABLES ---- //
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/sqlite-db.sqlite'
});


// ---- TODO ITEMS ---- //
var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});


// ---- METHODS ---- //
sequelize.sync().then(function() {
    console.log('Everything is synced');

    Todo.create({
        description: 'Slay the dragon',
    }).then(function() {
        return Todo.findAll({
            where: {
                description: {
                    $like: '%girl%'
                }
            }
        });
    }).then(function(todos) {
        if (todos) {
            todos.for Each(function(todo) {
                console.log(todo.toJSON());
            });
        }
        else {
            console.log('No todo found');
        }
    }).catch(function(e) {
        console.log(e);
    });
});
