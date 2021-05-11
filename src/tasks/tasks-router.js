const express = require('express');
const xss = require('xss');
const TasksServices = require('./tasks-services');
const TasksRouter = express.Router();
const jsonParser = express.json();

//serialize task in case of xss attack
const serializeTask = task => ({
    content: xss(task.content),
    id: task.id,
    modified: task.modified,
    complete: task.complete
});

//get all tasks and add new task
TasksRouter
 .route('/')
 .get((req, res, next) => {
     const knexInstance = req.app.get('db');
     TasksServices.getAllTasks(knexInstance)
      .then(tasks => { 
          res.json(tasks.map(serializeTask)) })
      .catch(next);
 })
 .post(jsonParser, (req, res, next) => {
     const knexInstance = req.app.get('db');
     const { content, modified, complete } = req.body;
     const newTask = { content, modified, complete };

     //each value in new task is required, verify that they were sent
     for(const [key, value] of Object.entries(newTask)){
         if(value == null){
             return res.status(400).json({
                 error: { message: `Missing '${key}' in request body'`}
             });
         }
     }

     TasksServices.insertTask(knexInstance, newTask)
      .then(task => {
          res
            .status(201)
            .location(req.originalUrl + `/${task.id}`)
            .json(serializeTask(task))
      })
      .catch(next);
 });

 //get, update, or delete specific task
 TasksRouter
  .route('/:id')
  .all((req, res, next) => {
      const knexInstance = req.app.get('db');
      const id = Number(req.params.id);

      TasksServices.getTaskById(knexInstance, id)
       .then(task => {
           if(!task){ 
               return res.status(404).json({
                   error: { message: `Task doesn't exist`}
               });
           }
           res.task = task;
           next();
       })
       .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeTask(res.task));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db');
    const deleteTaskId = res.task.id;

    TasksServices.deleteTask(knexInstance, deleteTaskId)
       .then(() => res.status(204).end())
       .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const updateTaskId = res.task.id;
    const { content, id, modified, complete } = req.body;
    const updatedTask = { content, id, modified, complete };

    //check that at least one field is getting updated in order to patch
    const numberOfValues = Object.values(updatedTask).filter(Boolean).length 
    if(numberOfValues === 0){
        return res.status(400).json({
            error: { 
                message: `Request body must contain either 'content, id, modified, or complete'`
            }
        });
    }

    updatedTask.date_modified = new Date();

    TasksServices.updateTask(knexInstance, updateTaskId, updatedTask)
     .then(() => res.status(204).end())
     .catch(next);
  });

 module.exports = TasksRouter;