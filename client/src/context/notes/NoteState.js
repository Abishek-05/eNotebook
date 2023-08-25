import React, { useState } from "react";
import NoteContext from "./NoteContext"; //Context is similar to a container which contains states which can be accessed by all components in a hierarchy. See App.js, all the components wrapped under NoteState will have access to states defined in NoteState

const NoteState = (props)=>{
	// const host = "http://localhost:5000";
	const host = "https://enotebook-api.vercel.app";
	const [notes,setNotes] = useState([]);

	//Fetch all notes
	const getNotes = async()=>{
		//API call
		const response = await fetch(`${host}/api/notes/fetchallnotes`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"auth-token" : localStorage.getItem('authToken')
			}
		});

		const json = await response.json();
		setNotes(json);
	}

	//Add a note
	const addNote = async (title, description,tag)=>{
		//API call
		const response = await fetch(`${host}/api/notes/addnote`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"auth-token" : localStorage.getItem('authToken')
			},
			body: JSON.stringify({title,description,tag})
		});

		console.log("New note added");
		const newNote = await response.json();
		setNotes(notes.concat(newNote)); //Do not use notes.push(note). concat() returns the array after updating. push() dosen't.
	}

	//Edit a note
	const editNote = async (id,title,description,tag)=>{
		//API call
		const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"auth-token" : localStorage.getItem('authToken')
			},
			body: JSON.stringify({title,description,tag})
		});

		const updatedNote = await response.json();
		//Logic to edit
		const newNotes = notes.map((note) =>{
			if(note._id === id)
				return updatedNote;
			return note;
		});
		setNotes(newNotes);
		//setNotes() will re render the UI. If we use the old array for updation and do setNotes(notes), we are passing the same array reference and UI will not be re rendered as React will think the state has not changed. So we need to create a copy array and then change state to that copy.
	}

	//Delete a note
	const deleteNote = async (id)=>{
		//API call
		const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"auth-token" : localStorage.getItem('authToken')
			}
		});
		const newNotes = notes.filter((note) => {return note._id !== id});
		setNotes(newNotes);
		console.log(response);
	}
	
	return (
		// {{notes:notes,setNotes:setNotes}} => shorthand => {{notes, setNotes}}. Key will become same as variable name of value.
		<NoteContext.Provider value={{notes,addNote,editNote,deleteNote,getNotes}}>
			{props.children}
		</NoteContext.Provider>
	)
}

export default NoteState;