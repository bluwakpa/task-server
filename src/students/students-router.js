const express = require('express');
const xss = require('xss');
const NotesService = require('./notes-service');
const notesRouter = express.Router();
const jsonParser = express.json();

//serialize note in case of xss attack
const serializeNote = note => ({
    id: note.id,
    name: xss(note.name),
    content: xss(note.content),
    modified: note.modified,
    folderId: note.folderId
});

//get all notes and add new note
notesRouter
 .route('/')
 .get((req, res, next) => {
     const knexInstance = req.app.get('db');
     NotesService.getAllNotes(knexInstance)
      .then(notes => { 
          res.json(notes.map(serializeNote)) })
      .catch(next);
 })
 .post(jsonParser, (req, res, next) => {
     const knexInstance = req.app.get('db');
     const { name, content, folderId, modified } = req.body;
     const newNote = { name, content, folderId, modified };

     //each value in new note is required, verify that they were sent
     for(const [key, value] of Object.entries(newNote)){
         if(value == null){
             return res.status(400).json({
                 error: { message: `Missing '${key}' in request body'`}
             });
         }
     }

     NotesService.insertNote(knexInstance, newNote)
      .then(note => {
          res
            .status(201)
            .location(req.originalUrl + `/${note.id}`)
            .json(serializeNote(note))
      })
      .catch(next);
 });

 //get, update, or delete specific note
 notesRouter
  .route('/:id')
  .all((req, res, next) => {
      const knexInstance = req.app.get('db');
      const noteId = req.params.id;

      NotesService.getNoteById(knexInstance, noteId)
       .then(note => {
           if(!note){ 
               return res.status(404).json({
                   error: { message: `Note doesn't exist`}
               });
           }
           res.note = note;
           next();
       })
       .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db');
    const deleteNoteId = res.note.id;

    NotesService.deleteNote(knexInstance, deleteNoteId)
       .then(() => res.status(204).end())
       .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const updateNoteId = res.note.id;
    const { name, content, folderId, modified } = req.body;
    const updatedNote = { name, content, folderId, modified };

    //check that at least one field is getting updated in order to patch
    const numberOfValues = Object.values(updatedNote).filter(Boolean).length 
    if(numberOfValues === 0){
        return res.status(400).json({
            error: { 
                message: `Request body must contain either 'note_name', 'content', or 'folder_id'`
            }
        });
    }

    updatedNote.date_modified = new Date();

    NotesService.updateNote(knexInstance, updateNoteId, updatedNote)
     .then(() => res.status(204).end())
     .catch(next);
  });

 module.exports = notesRouter;