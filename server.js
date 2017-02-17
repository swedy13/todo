var express = require('express');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
    id: 1,
    description: 'Get stronger',
    completed: false
},{
    id: 2,
    description: 'Be happy',
    completed: false
},{
    id: 3,
    description: 'Make money',
    completed: true
}];


app.get('/', function(req, res) {
    res.send('Todo API Root');
});

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


app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});
