var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
    var todo = parseInt(req.params.id, 10);
    var match = _.findWhere(todos, {id: todo});

    if (match) {
        res.json(match);
        return;
    }
    res.status(404).send();
});


// ---- POST METHODS ---- //
// To Dos
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    body.description = body.description.trim();

    // Return empty body if the request is bad or empty
    if (!_.isString(body.description) ||
        !_.isBoolean(body.completed) ||
        body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.id = todoNextId++;
    todos.push(body);

    res.json(body);
});


// ---- DELETE METHODS ---- //
app.delete('/todos/:id', function(req, res) {
    var todo = parseInt(req.params.id, 10);
    var match = _.findWhere(todos, {id: todo});

    if (!match) {
        res.status(404).json({"error": "No item found with that id"});
    }
    else {
        todos = _.without(todos, match);
        res.json(match);
    }
});


// ---- PUT METHODS ---- //
app.put('/todos/:id', function(req, res) {
    var todo = parseInt(req.params.id, 10);
    var match = _.findWhere(todos, {id: todo});
    var body = _.pick(req.body, 'description', 'completed');
    var validAttr = {};

    if (!match) {
        return res.status(404).send();
    }

    // Completion Status
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttr.completed = body.completed;
    }
    else if (body.hasOwnProperty('completed')) {
        res.status(400).send();
    }

    // Description Status
    if (body.hasOwnProperty('description') &&
        _.isString(body.description) &&
        body.description.trim().length > 0) {
        validAttr.description = body.description;
    }
    else if (body.hasOwnProperty('description')) {
        res.status(400).send();
    }

    // Update
    _.extend(match, validAttr);
    res.json(match);
});


// ---- START SERVER ---- //
app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});
