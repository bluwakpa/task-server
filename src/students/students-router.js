const express = require('express');
const xss = require('xss');
const StudentsService = require('./students-service');
const StudentsRouter = express.Router();
const jsonParser = express.json();

//serialize student in case of xss attack
const serializeNote = student => ({
    id: student.id,
    name: xss(student.name),
    content: xss(student.content),
    modified: student.modified,
});

//get all students and add new student
studentsRouter
 .route('/')
 .get((req, res, next) => {
     const knexInstance = req.app.get('db');
     StudentsService.getAllNotes(knexInstance)
      .then(students => { 
          res.json(students.map(serializeNote)) })
      .catch(next);
 })
 .post(jsonParser, (req, res, next) => {
     const knexInstance = req.app.get('db');
     const { name, content, modified } = req.body;
     const newNote = { name, content, modified };

     //each value in new note is required, verify that they were sent
     for(const [key, value] of Object.entries(newStudent)){
         if(value == null){
             return res.status(400).json({
                 error: { message: `Missing '${key}' in request body'`}
             });
         }
     }

     StudentsService.insertNote(knexInstance, newStudent)
      .then(student => {
          res
            .status(201)
            .location(req.originalUrl + `/${student.id}`)
            .json(serializeNote(student))
      })
      .catch(next);
 });

 //get, update, or delete specific student
 notesRouter
  .route('/:id')
  .all((req, res, next) => {
      const knexInstance = req.app.get('db');
      const noteId = req.params.id;

      StudentsService.getNoteById(knexInstance, studentId)
       .then(student => {
           if(!student){ 
               return res.status(404).json({
                   error: { message: `Student doesn't exist`}
               });
           }
           res.student = student;
           next();
       })
       .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.student));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db');
    const deleteStudentId = res.student.id;

    NotesService.deleteNote(knexInstance, deleteStudentId)
       .then(() => res.status(204).end())
       .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const updateStudentId = res.student.id;
    const { name, content, folderId, modified } = req.body;
    const updatedStudent = { name, content, folderId, modified };

    //check that at least one field is getting updated in order to patch
    const numberOfValues = Object.values(updatedStudent).filter(Boolean).length 
    if(numberOfValues === 0){
        return res.status(400).json({
            error: { 
                message: `Request body must contain either 'student_name', 'content', or 'student_id'`
            }
        });
    }

    updatedStudent.date_modified = new Date();

    StudentsService.updateNote(knexInstance, updateStudentId, updatedStudent)
     .then(() => res.status(204).end())
     .catch(next);
  });

 module.exports = notesRouter;