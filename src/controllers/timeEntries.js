const { endOfDay } = require('date-fns')
const { startOfDay } = require('date-fns')
const timeEntriesRouter = require('express').Router()
const TimeEntry = require('../models/timeEntry')
const Action = require('../models/action')
const User = require('../models/user')

// get all timeEntries for a action
timeEntriesRouter.get('/:actionId', async (request, response) => {
  const user = await User.findById(request.userId)
  const action = await Action.findById(request.params.actionId)
  if (action && user && action.user.toString() === user.id.toString() ) {
    const timeEntries = await TimeEntry.find({action: request.params.actionId})
    response.json(timeEntries.map(timeEntry => timeEntry))
  } else {
    return response.status(400).json({ error: 'No timeEntries found for the action' })
  }
})

// create a new timeEntry
timeEntriesRouter.post('/', async (request, response) => {
  const { actionId, date } = request.body
  // TODO: Add error handler when action is not found
  const action = await Action.findById(actionId)
  const timeEntries = await TimeEntry.find({
      action: actionId,
      date: {
        $gte: startOfDay(new Date(date)),
        $lte: endOfDay(new Date(date))
      }
    });
  console.log(startOfDay(new Date(date)), endOfDay(new Date(date)), timeEntries, startOfDay(new Date(date)), endOfDay(new Date(date)));

  if (timeEntries.length) {
    return response.status(400).json({ error: 'There is already time entry for the date' })
  }

  const timeEntry = new TimeEntry({
    action: action._id,
    user: request.userId,
    date: Date.now()
  })

  const savedTimeEntry = await timeEntry.save()
  response.json(savedTimeEntry)
})

// (drafted) update an timeEntry
timeEntriesRouter.put('/:id', (request, response, next) => {
  // TODO: Add authorization to this API
  const id = request.params.id;

  TimeEntry.findByIdAndUpdate(id, request.body, { new: true })
    .then(updatedTimeEntry => {
      response.json(updatedTimeEntry)
    })
    .catch(error => next(error))
})

timeEntriesRouter.delete('/:id', async (request, response) => {
  const user = await User.findById(request.userId)
  const timeEntry = await TimeEntry.findById(request.params.id)
  if (timeEntry.user.toString() === request.userId ) {
    await TimeEntry.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
})

module.exports = timeEntriesRouter