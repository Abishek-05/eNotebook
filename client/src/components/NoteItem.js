import React,{useContext} from 'react'
import noteContext from '../context/notes/NoteContext';

const NoteItem = (props) => {
	const {note,updateNote} = props;
	const context = useContext(noteContext);
	const {deleteNote} = context;

	return (

	<div className="card text-bg-dark mb-3 col-md-3 my-3 mx-4">
		<div className="card-body">
			<h5 className="card-title">{note.title} | {note.tag}</h5>
			<p className="card-text">{note.description}</p>
			<i className="fa-solid fa-trash" style={{float:"right", color: "#ff0000"}} onClick={ ()=>{deleteNote(note._id)} }></i>
			<i className="fa-solid fa-pen mx-3" style={{float:"right",color: "#46bb1b"}} onClick = { ()=>{updateNote(note)}} data-bs-toggle="modal" data-bs-target="#editModal"></i>
			
		</div>
	</div>
	)
}

export default NoteItem
