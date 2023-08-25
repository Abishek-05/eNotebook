const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
	//Similar to a foreign key, to associate each note to a user
	user : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'users' //refers to users DB
	},
	title: {
		type : String,
		required : true
	},
	description : {
		type : String,
		required : true
	},
	tag : {
		type : String,
		default : "General"
	},
	date : {
		type : Date,
		default : Date.now
	}
});

module.exports = mongoose.model('notes', NotesSchema); //The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name.