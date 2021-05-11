require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const knex = require('knex')
const { NODE_ENV } = require('./config')
const tasksRouter = require('./tasks/tasks-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors({
    origin: 'http://localhost:3000'
}))

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

// endpoint url to router connection
app.use('/api/tasks', tasksRouter)

// app.get('/tasks', (req, res, next) => {
//     const knexInstance = req.app.get('db')
//     ArticlesService.getAllArticles(knexInstance)
//     .then(tasks => {
//         res.json(articles)
//       })
//       .catch(next)
//   });

app.use(function errorHandler(error, req, res, next) {
    let response
    console.error(error)
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app