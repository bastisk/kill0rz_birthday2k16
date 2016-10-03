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

router.get('/', isAuthenticated, function (req, res) {
    res.render('profile', {
        user: req.user
    });
});

router.post('/edit', isAuthenticated, function (req, res) {
    User.findByIdAndUpdate(req.user._id, req.body, function (err, post) {
        if (err) return next(err);
        res.redirect('/profile');
    });

});

router.post('/password', isAuthenticated, function (req, res) {
    if (isValidPassword(req.user, req.body.password_old)) {
        if (req.body.password_new == req.body.password_newrepeat)
            User.findByIdAndUpdate(req.user._id, {
                password: createHash(req.body.password_new)
            }, function (err, post) {
                if (err) return next(err);
                res.redirect('/profile');
            });
    };

});
module.exports = router;

var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
}

var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}