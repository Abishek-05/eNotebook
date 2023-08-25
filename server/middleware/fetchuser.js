const jwt = require('jsonwebtoken');
const JWT_SECRET_STRING = 'thisIsMySignature'; //Ideally we should have added this to ENV.var but to make things simple we hardcode it. Make sure it is the same across all files.

//Objective: Get the data(user.id) from jwt token and append it to req obj
const fetchuser = (req, res, next) =>{
	
	//req header has the auth token under the name 'auth-token'
	const token = req.header('auth-token');
	if(!token)
		return res.status(401).json({error : "Please authenticate using valid token"});

	try 
	{
		const data = jwt.verify(token,JWT_SECRET_STRING);//Verify to ensure token was not tampered
		req.user = data.user; //See line 89 in auth.js. The data is user : {id : ..}. Now it adds .user field to the req obj
		next(); //Calls then next middleware in sequence. See line 106 in auth.js. That async func is the next middleware in sequence.
	} 
	catch(error)
	{
		return res.status(401).json({error : "Please authenticate using valid token"});
	}
}
module.exports = fetchuser;