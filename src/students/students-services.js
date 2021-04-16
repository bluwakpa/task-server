//manage database interactions for notes
const NotesService = {
    getAllNotes(knex){
        return knex
         .select('*')
         .from('notes');
    },
    insertNote(knex, newNote){
        return knex
         .insert(newNote)
         .into('notes')
         .returning('*')
         .then(rows => { return rows[0] });
    },
    getNoteById(knex, noteId){
        console.log("noteId", noteId);
        return knex
         .select('*')
         .from('notes')
         .where('id', noteId)
         .first(); //get note itself
    },
    deleteNote(knex, noteId){
        return knex('notes')
         .where('id', noteId)
         .delete();
    },
    updateNote(knex, noteId, updatedNote){
        return knex('notes')
         .where('id', noteId)
         .update(updatedNote);
    }
};

module.exports = NotesService;