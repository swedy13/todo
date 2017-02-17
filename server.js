var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;


// ---- MIDDLEWARE ---- //
app.use(bodyParser.json());


// ---- GET METHODS ---- //
// Home
app.get('/', function(req, res) {
    res.send('Todo API Root');
});

// To Dos
app.get('/todos', function(req, res) {
    res.json(todos);
});
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var match;

    todos.forEach(function(todo) {
        if (todoId === todo.id) {
            match = todo;
        }
    });

    if (match) {
        res.json(match);
    }
    else {
        res.status(404).send();
    }
});


// ---- POST METHODS ---- //
// To Dos
app.post('/todos', function(req, res) {
    var body = req.body;

    body.id = todoNextId++;
    todos.push(body);

    res.json(body);
});



app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});
