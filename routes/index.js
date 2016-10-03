var express = require('express');
var router = express.Router();
var solver = require('../helpers/taskfunctions.js');
var Task = require('../models/task');
var nodemailer = require('nodemailer');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/login', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash : true
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/login',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	/* GET Home Page */
	router.get('/', isAuthenticated, function(req, res){
            res.render('index', { user: req.user});
	});

	router.get('/geschenk', isAuthenticated, function(req, res){
		Task.find(function(err, tasks){
			res.render('geschenk', {
					user: req.user,
					tasks: tasks
			});
	});
});

router.post('/geschenk', isAuthenticated, function(req, res){
	var feedback = req.body.feedback;

var transporter = nodemailer.createTransport('');

	var mailOptions = {
	};
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
	res.redirect('/geschenk');

});

	router.post('/testurl', function(req, res){
	  var test = req.body.data;
		console.log(test);

		var data = JSON.parse(test);
		var result = solver.solvelorenz(data);

	  res.send(result);
	})

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}
