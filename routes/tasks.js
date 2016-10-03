var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Task = require('../models/task');
var bCrypt = require('bcrypt-nodejs');
var solver = require('../helpers/taskfunctions.js');

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

router.get('/', isAuthenticated, function (req, res) {
    Task.find(function(err, tasks){
      res.render('tasks', {
          user: req.user,
          tasks: tasks
      });
    });
});

router.get('/:id', isAuthenticated, function (req, res){
    res.render('tasks/task' + req.params.id, { user: req.user});
});

router.post('/:id', isAuthenticated, function (req, res) {
  var solution = req.body.url;
  solver.solve(req.params.id, solution, function(testcase){
    console.log(testcase);
    if(testcase == true){
        Task.findOne({'id': 1}, function(err, foundex) {
          if(!foundex){
            var newtask = new Task({
              id: 1,
              max_points: 1,
              needed_points: 1,
              score: 1,
            });
            newtask.save(function(err) {
                if (err)
                  console.log(err);
            });
          }
        });
    }
  });
  res.redirect('/tasks');

});


module.exports = router;
