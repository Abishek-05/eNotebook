const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

const router = express.Router();

//*****Notes structure***** => user, title, description, tag. User field directly stores ID ie. user : '..' and not user : {id : '..'} => This format only in req obj (see line 14)

//1 : Get all notes of a user using 'GET /api/notes/fetchallnotes'
router.get('/fetchallnotes', 
	fetchuser, 
	async (req,res) =>
	{
		try
		{
			const notes = await Notes.find({user : req.user.id});
			res.json(notes);
		}
		catch(error) 
		{
			console.error(error);
			return res.status(500).json({ error:'Internal server error', message : error.message});
		}
	}
);

//2 : Add a new note using 'POST /api/notes/addnote'
router.post('/addnote', 
	fetchuser,
	[
		body('title', 'Enter a valid title').exists(),
		body('description', 'Enter a valid description').exists()
	],
	async (req,res) =>
	{
		const result = validationResult(req);
		if (!result.isEmpty()) 
			return res.status(400).json({ errors: result.array() });
			
		try 
		{
			const note = await Notes.create({
			user: req.user.id,
			title: req.body.title,
			description: req.body.description,
			tag: req.body.tag
			});

			res.json(note);
		} 
		catch(error) 
		{
			console.error(error);
			return res.status(500).json({ error:'Internal server error', message : error.message});
		}
	}
);

//3 : Update existing note using 'PUT /api/notes/updatenote'
router.put('/updatenote/:id', 
	fetchuser,
	async (req,res) =>
	{
		try 
		{
			let note = await Notes.findById(req.params.id); //note id is a slug, see line 61
			if(!note)
				return res.status(404).json({error : "Note not found"});

			if(note.user.toString() !== req.user.id)
				return res.status(401).json({error : "Unauthorized"});

			let updatedTitle = note.title;
			let updatedDescription = note.description;
			let updatedTag =  note.tag;

			if(req.body.title) updatedTitle = req.body.title;
			if(req.body.description) updatedDescription = req.body.description;
			if(req.body.tag) updatedTag = req.body.tag;

			// console.log(updatedTitle + " " + updatedDescription + " " + updatedTag);

			note = await Notes.findOneAndUpdate( {_id : req.params.id}, {$set : {title: updatedTitle, description: updatedDescription, tag: updatedTag}},{new : true});
			res.json(note);
			// Usually when you perform update operations in mongoose, it returns the previous state of the document (before it was updated) and not the updated one. By setting "new" to true in the third argument of the object in "findOneAndUpdate()", we tell mongoose to return the updated state of the object instead of its default behaviour
		} 
		catch(error) 
		{
			console.error(error);
			return res.status(500).json({ error:'Internal server error', message : error.message});
		}
	}
);

//4 : Delete note using 'DELETE /api/notes/deletenote'
router.delete('/deletenote/:id', 
	fetchuser,
	async (req,res) =>
	{
		try 
		{
			let note = await Notes.findById(req.params.id); //note id is a slug, see line 97
			if(!note)
				return res.status(404).json({error : "Note not found"});

			if(note.user.toString() !== req.user.id)
				return res.status(401).json({error : "Unauthorized"});

			note = await Notes.findByIdAndDelete(req.params.id);
			res.json({message : "Note has been deleted successfully", serverResponse : note});
		} 
		catch(error) 
		{
			console.error(error);
			return res.status(500).json({ error:'Internal server error', message : error.message});
		}
	}
);
module.exports = router;