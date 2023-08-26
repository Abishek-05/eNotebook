import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Login = (props) => {
	const {showAlert} = props;
	const [credentials, setCredentials] = useState({email:"", password:""});
	let naviagte = useNavigate();

	const handleDataChange = (e)=>{
		setCredentials({...credentials, [e.target.name] : e.target.value}); //...note => retain the current state of the note and replace only the field where the change event has happened. Now we have created a common func to hadle changes in every field.
	}
	const handleSubmit = async (e)=>{
		e.preventDefault();
		// const host = "http://localhost:5000";
		const host = "https://enotebook-api-abishek-05.vercel.app";
		const response = await fetch(`${host}/api/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({email:credentials.email, password: credentials.password})
		});
		
		const respJson = await response.json();
		// console.log(respJson);

		//See structure of respJson on backend auth.js line 95. If success attribute is true, it means that login is success and user can be redirected to home page
		if(respJson.success)
		{
			localStorage.setItem('authToken',respJson.authToken);
			naviagte("/");
			showAlert("Login Successful", "success");
		}
		else
		{
			const errorMsg = respJson.error ?respJson.error :respJson.errors[0].msg;
			showAlert(errorMsg, "danger");
		}
	}

	return (

	<div className="container d-flex flex-column justify-content-center align-items-center my-3">
		<h2>Login to access your notes !</h2>
		<form onSubmit={handleSubmit}>
			<div className="mb-3 my-4">
				<label htmlFor="email" className="form-label">Email</label>
				<input type="email" className="form-control text-bg-dark" id="email" name="email" value={credentials.email} onChange={handleDataChange} aria-describedby="emailHelp"/>
			</div>
			<div className="mb-3 my-4">
				<label htmlFor="password" className="form-label">Password</label>
				<input type="password" className="form-control text-bg-dark" id="password" name="password" value={credentials.password} onChange={handleDataChange}/>
			</div>
			<button type="submit" className="btn btn-primary">Login</button>
		</form>
	</div>
	)
}
export default Login
