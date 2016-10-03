var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

var isAdmin = function (req, res, next) {
    if(req.user.role == "admin")
        return next();
    res.redirect('/');
}
var isTrainer = function (req, res, next) {
    if(req.user.role == "trainer")
        return next();
    res.redirect('/');
}

router.get('/',isAuthenticated, isAdmin, function (req, res, next) {
    User.find(function (err, users) {
        if (err) return next(err);
        res.render('users', {
            users: users,
            user: req.user
        });
    });
});

router.get('/edit/:id', isAuthenticated, isAdmin, function(req, res, next) {
    User.findOne({ '_id': req.params.id }, function(err, foundex) {
        if(err) return next(err);
        res.render('user_edit', { user_1: foundex, user: req.user });
    });
});

router.post('/edit/:id', isAuthenticated, isAdmin, function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.redirect('/users');
    });
});

router.get('/add', isAuthenticated, isAdmin, function (req, res, next) {
        res.render('user_add', { user: req.user});
    });

router.post('/add', isAuthenticated, isAdmin, function(req, res) {
    var newUser = new User();
    newUser.username = req.body.username;
    newUser.password = createHash(req.body.password);
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.role = req.body.role;
    newUser.email = req.body.email;
    newUser.save(function(err) {
        if (err)
            res.redirect('/');
        res.redirect('/users');
    });
});

router.post('/delete/:id', isAuthenticated, isAdmin, function(req, res, next) {
    User.findOneAndRemove({ _id: req.params.id }, function (err, post) {
        if (err) return next(err);
        res.redirect('/users');
    });
});

module.exports = router;

var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}