var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	username: String,
	password: String,
	email: String,
  role: String,
	level: Number
});
