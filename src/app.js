const express = require('express')
const app = express()
const middleware = require('./utils/middleware')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const habitRouter = require('./controllers/habits')
const activityRouter = require('./controllers/actions')

app.use(express.json());
app.use(middleware.extractToken)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/habits', middleware.authenticate, habitRouter)
app.use('/api/actions', middleware.authenticate, actionRouter)

module.exports = app