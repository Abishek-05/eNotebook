import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/notes/NoteContext';
import NoteItem from './NoteItem';
import AddNote from '../components/AddNote';

const Notes = () => {
	const context = useContext(noteContext);
	const {notes,getNotes,editNote} = context; //Destructuring
	let naviagte = useNavigate();

	//Populate notes var initially
	useEffect(()=>{
		if(localStorage.getItem('authToken')) //Only if authToken is present in localStroage, notes should be fetched
			getNotes();
		else
			naviagte("/login");
		//eslint-disable-next-line
	},[]);

	const [note, setNote] = useState({title:"", description:"", tag:""});
	const handleDataChange = (e)=>{
		setNote({...note, [e.target.name] : e.target.value}); //...note => retain the current state of the note and replace only the field where the change event has happened. Now we have created a common func to hadle changes in every field.
	}
	const handleEditNote = (e)=>{
		e.preventDefault();
		editNote(note._id,note.title, note.description, note.tag);
	}

	//Will be triggerd from NoteItem.js line 16
	const updateNote = (currNote)=>{
		setNote(currNote);
	}
	return (
		<>
		<AddNote/>

		<div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalTitle" aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered" role="document">
				<div className="modal-content" style={{background: "linear-gradient(27deg, rgba(239,255,126,1) 20%, rgba(91,196,147,1) 88%"}}>
					<div className="modal-header">
						<h5 className="modal-title" id="exampleModalLongTitle">Edit note</h5>
						<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
					</div>
					
					<div className="modal-body">
						<form onSubmit={handleEditNote}>
							<div className="mb-4">
								<label htmlFor="title" className="form-label">Title</label>
								<input type="text" className="form-control text-bg-dark" id="title" name="title" value={note.title} onChange={handleDataChange} minLength={5} required/> 
							</div>
							<div className="mb-4">
								<label htmlFor="description" className="form-label">Description</label>
								<input type="text" className="form-control text-bg-dark" id="description" name="description" value={note.description} onChange={handleDataChange} minLength={5} required/>
							</div>

							<div className="mb-4">
								<label htmlFor="title" className="form-label">Tag</label>
								<input type="text" className="form-control text-bg-dark" id="title" name="title" value={note.tag} onChange={handleDataChange}/> 
							</div>
							<div className="modal-footer">
								<button disabled={note.title.length < 5 || note.description.length < 5 } type="submit" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#editModal">Update</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div className="container ">
			<h2>Your notes</h2>
			{notes.length === 0 ?'No notes to display' :""}
			<div className="row">
				{
					notes.map( (note) => {
						return <NoteItem key = {note._id} updateNote={updateNote} note = {note}/>; //Passing props
					})
				}
			</div>
		</div>
		</>
  )
}

export default Notes
