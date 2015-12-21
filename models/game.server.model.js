var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var GameSchema = new Schema({
	appid: Number,
	name: String
});

mongoose.model('Game',GameSchema);
