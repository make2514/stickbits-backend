const express = require('express')
const app = express()
var cors = require('cors')

// enable cors
app.options('*', cors())
app.use(cors())

const middleware = require('./utils/middleware')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const habitRouter = require('./controllers/habits')
const actionRouter = require('./controllers/actions')
const timeEntryRouter = require('./controllers/timeEntries')



app.use(express.json())
app.use(middleware.extractToken)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/habits', middleware.authenticate, habitRouter)
app.use('/api/actions', middleware.authenticate, actionRouter)
app.use('/api/timeEntries', middleware.authenticate, timeEntryRouter)

module.exports = app