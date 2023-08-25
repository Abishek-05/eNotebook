const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://Abishek_05:abi123@enotebookcluster.debgke0.mongodb.net/enotebook?retryWrites=true&w=majority';

const connectToMongo = async ()=>{
	try{
		await mongoose.connect(mongoURI);
		console.log("Connected to MongoDB - Database enotebook");
	}
	catch(error){
		console.log(error);
	}
};

module.exports = connectToMongo;