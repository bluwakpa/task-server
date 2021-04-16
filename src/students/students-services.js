//manage database interactions for students
const StudentsService = {
    getAllStudents(knex){
        return knex
         .select('*')
         .from('students');
    },
    insertStudent(knex, newStudent){
        return knex
         .insert(newStudent)
         .into('students')
         .returning('*')
         .then(rows => { return rows[0] });
    },
    getStudentById(knex, studentId){
        console.log("studentId", studentId);
        return knex
         .select('*')
         .from('students')
         .where('id', studentId)
         .first(); //get student itself
    },
    deleteStudent(knex, studentId){
        return knex('students')
         .where('id', studentId)
         .delete();
    },
    updateStudent(knex, studentId, updatedStudent){
        return knex('students')
         .where('id', studentId)
         .update(updatedStudent);
    }
};

module.exports = StudentsService;