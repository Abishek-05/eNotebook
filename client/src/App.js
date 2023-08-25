import './App.css';
import React,{useState} from 'react';
import { BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
	const [alert, setAlert] = useState(null);

	const showAlert = (message, type)=>{
		setAlert(
			{
				msg : message,
				type : type
			}
		)
		setTimeout(() => {
			setAlert(null);
		}, 2000);
	}
	
	return (
	<>
		<Router>
			<Navbar/>
			<Alert alert = {alert}/>
			
			<NoteState> {/* Explanation in NoteState.js file */}
				<Routes>
					<Route path='/' element={<Home/>}/>
					<Route path='/login' element={<Login showAlert={showAlert}/>}/>
					<Route path='/signup' element={<Signup showAlert={showAlert}/>}/>
				</Routes>
			</NoteState>
		</Router>
	</>
	);
}

export default App;
