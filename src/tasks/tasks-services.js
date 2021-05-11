//manage database interactions for tasks
const TasksServices = {
    getAllTasks(knex){
        return knex
         .select('*')
         .from('tasks');
    },
    insertTask(knex, newTask){
        return knex
         .insert(newTask)
         .into('tasks')
         .returning('*')
         .then(rows => { return rows[0] });
    },
    getTaskById(knex, id){
        console.log("id", id);
        return knex
         .select('*')
         .from('tasks')
         .where('id', id)
         .first(); //get task itself
    },
    deleteTask(knex, id){
        return knex('tasks')
         .where('id', id)
         .delete();
    },
    updateTask(knex, id, updatedTask){
        return knex('tasks')
         .where('id', id)
         .update(updatedTask);
    }
};

module.exports = TasksServices;