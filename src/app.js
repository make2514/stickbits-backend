const express = require('express')
const app = express()
const middleware = require('./utils/middleware')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json());
app.use(middleware.extractToken)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app