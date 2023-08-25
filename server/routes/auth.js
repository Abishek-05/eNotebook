const express = require('express');
const Users = require('../models/Users');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const router = express.Router();

//1 : Create a user / Sign up using 'POST: /api/auth/createuser'

//2nd parameter of router.post() is the validation part
router.post('/createuser', 
	[
		body('name', 'Name must be atleast 3 characters').isLength({min : 3}),
		body('email', 'Enter a valid email address').isEmail(),
		body('password', 'Password must be atleast 5 characters').isLength({min : 5})
	],
	async (req,res) =>
	{
		// console.log(req.body);

		//Result of the validation performed above is obtained
		const result = validationResult(req);
		if (!result.isEmpty()) 
			return res.status(400).json({ errors: result.array() });

		try 
		{
			const salt = await bcrypt.genSalt(10);
			const securePassword = await bcrypt.hash(req.body.password, salt);

			//Users is the model created from users schema(line 2). Use mongoose methods to create a document from this model
			const user = await Users.create({
				name: req.body.name,
				email: req.body.email,
				password: securePassword
			});
			// or
			// const user = Users(name:req.body.name, ..and so on);
			// await user.save();

			//Now we need send an authentication token to user as response. We use jwt for that purpose. Every user has an object id in MongoDB. It will be easy for retrieval if we have the objectID. So we will use objectID as data, and sign it with our signature and send that token to user. User cannot change the objectID to get access to another user's info as signature will change 
			const JWT_SECRET_STRING = 'thisIsMySignature';
			const data = {
				user : {
					id : user._id //id is automatically added upon creation in MongoDB
				}
			}
			const authToken = jwt.sign(data, JWT_SECRET_STRING);
			res.json({success: true, authToken : authToken}); //Send the token
		} 
		catch(error) 
		{
			if(error.code === 11000)
				return res.status(400).json({ success: false, error:'Email already exists', message : error.message }); // Duplicate key error
			
			console.error(error);
			return res.status(500).json({ success : false, error:'Internal server error', message : error.message});
		}
	}
);

//2 : Authenticate a user using 'POST: /api/auth/login'
router.post('/login', 
	[
		body('email', 'Enter a valid email address').isEmail(),
		body('password', 'Password cannot be empty').exists() //exists() to check not empty cond.
	],
	async (req,res) =>
	{
		const result = validationResult(req);
		if (!result.isEmpty()) 
			return res.status(400).json({ errors: result.array() });
		
		try 
		{
			const user = await Users.findOne({email : req.body.email});
			//user now contains id,name,email,pwd.
			if(!user)
				return res.status(400).json({success:false ,error : 'Sorry! User does not exist.'});
			const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
			if(!isPasswordCorrect)
				return res.status(400).json({success:false, error : 'Invalid credentials'})
			
			//If it is a valid user, create and send token.
			const JWT_SECRET_STRING = 'thisIsMySignature';
			//Token data contains id. Token format => header + payload (data) + signature
			const data = {
				user : {
					id : user._id
				}
			}
			const authToken = jwt.sign(data, JWT_SECRET_STRING);
			res.json({success: true, authToken : authToken}); //Send the token
		} 
		catch(error)
		{
			console.error(error);
			return res.status(500).json({ error:'Internal server error', message : error.message});
		}
	}
);

//3 : Get details for a logged in user 'POST: /api/auth/getuser' . We will use middleware fetchuser for this purpose
router.post('/getuser', 
	fetchuser,
	async (req,res) =>
	{
		try 
		{
			const userID = req.user.id;
			const user = await Users.findById(userID).select('-password'); //select all fields except password
			res.json(user);
		} 
		catch(error)
		{
			console.error(error);
			return res.status(500).json({ error:'Internal server error', message : error.message});
		}
	}
);

module.exports = router;