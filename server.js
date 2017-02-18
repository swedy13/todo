var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

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
  var query = req.query;
  var where = {};

  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true;
  }
  else if (query.hasOwnProperty('completed') && query.completed == 'false') {
    where.completed = false;
  }

  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {
      $like: '%' + query.q + '%'
    };
  }

  db.todo.findAll({where: where}).then(function(todos) {
    res.json(todos);
  }, function(e) {
    res.status(500).send();
  });
});

// To Do by ID
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);

  db.todo.findById(todoId).then(function(todo) {
    if (!!todo) {
      res.json(todo.toJSON());
    }
    else {
      res.status(404).send(); // Todo not found
    }
  }, function(e) {
    res.status(500).send();  // Server problem
  });
});


// ---- POST METHODS ---- //
// To Dos
app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  db.todo.create(body).then(function(todo) {
    res.json(todo.toJSON());
  }, function(e) {
    res.status(400).json(e);
  });
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

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
  });
});

