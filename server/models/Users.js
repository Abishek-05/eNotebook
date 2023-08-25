const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsersSchema = new Schema({
	name: {
		type : String,
		required : true
	},
	email : {
		type : String,
		required : true,
		unique : true
	},
	password : {
		type : String,
		required : true
	},
	date : {
		type : Date,
		default : Date.now
	}
});

module.exports = mongoose.model('users', UsersSchema); //The first argument is usually the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name. Here I have kept it as plural for convenience