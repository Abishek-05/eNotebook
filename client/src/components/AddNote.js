import React,{useContext, useState} from 'react'
import noteContext from '../context/notes/NoteContext';

const AddNote = () => {
	const context = useContext(noteContext);
	const {addNote} = context; //Destructuring

	const [note, setNote] = useState({title:"", description:"", tag:""});
	const handleDataChange = (e)=>{
		setNote({...note, [e.target.name] : e.target.value}); //...note => retain the current state of the note and replace only the field where the change event has happened. Now we have created a common func to hadle changes in every field.
	}
	const handleAddNote = (e)=>{
		e.preventDefault();
		addNote(note.title, note.description, note.tag);
		setNote({title:"", description:"", tag:""}); //Make the fields empty for next input
	}

  return (
	<div className="container my-3">
		<h2>Add a note</h2>
		<form onSubmit={handleAddNote}>
			<div className="mb-4">
				<label htmlFor="title" className="form-label">Title</label>
				<input type="text" className="form-control text-bg-dark" id="title" name="title" value={note.title} onChange={handleDataChange} minLength={5} required/> 
			</div>
			<div className="mb-4">
				<label htmlFor="description" className="form-label">Description</label>
				<input type="text" className="form-control text-bg-dark" id="description" name="description" value={note.description} onChange={handleDataChange} minLength={5} required/>
			</div>
			<div className="mb-4">
				<label htmlFor="tag" className="form-label">Tag</label>
				<input type="text" className="form-control text-bg-dark" id="tag" name="tag" value={note.tag} onChange={handleDataChange}/>
			</div>
			<button type="submit" className="btn btn-success">Add Note</button>
		</form>
	</div>
  )
}

export default AddNote
