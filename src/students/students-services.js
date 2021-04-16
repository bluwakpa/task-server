//manage database interactions for students
const StudentsService = {
    getAllNotes(knex){
        return knex
         .select('*')
         .from('students');
    },
    insertNote(knex, newStudent){
        return knex
         .insert(newStudent)
         .into('students')
         .returning('*')
         .then(rows => { return rows[0] });
    },
    getNoteById(knex, studentId){
        console.log("studentId", studentId);
        return knex
         .select('*')
         .from('students')
         .where('id', studentId)
         .first(); //get student itself
    },
    deleteNote(knex, studentId){
        return knex('students')
         .where('id', studentId)
         .delete();
    },
    updateNote(knex, studentId, updatedStudent){
        return knex('students')
         .where('id', studentId)
         .update(updatedStudent);
    }
};

module.exports = StudentsService;