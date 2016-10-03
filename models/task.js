var mongoose = require('mongoose');

module.exports = mongoose.model('Task',{
	id: String,
	max_points: Number,
  needed_points: Number,
  score: Number
});
