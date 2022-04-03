const actionsRouter = require('express').Router()
const Action = require('../models/action')
const Habit = require('../models/habit')
const User = require('../models/user')

// get all actions for a habit
actionsRouter.get('/:habitId', async (request, response) => {
  const user = await User.findById(request.userId)
  const habit = await Habit.findById(request.params.habitId)
  if (habit && user && habit.user.toString() === user.id.toString() ) {
    const actions = await Action.find({habit: request.params.habitId})
    response.json(actions.map(action => action.toJSON()))
  }
})

// create a new action
actionsRouter.post('/', async (request, response) => {
  const { name, level, habitId } = request.body
  // TODO: Add error handler when habit is not found
  const habit = await Habit.findById(habitId)

  if (!name || !level) {
    response.status(400).end()
    return
  }

  const action = new Action({
    name,
    level,
    habit: habit._id,
    user: request.userId,
    date: Date.now()
  })

  const savedAction = await action.save()
  response.json(savedAction.toJSON())
})

// (drafted) update an action
actionsRouter.put('/:id', (request, response, next) => {
  // TODO: Add authorization to this API
  const id = request.params.id;

  Action.findByIdAndUpdate(id, request.body, { new: true })
    .then(updatedAction => {
      response.json(updatedAction)
    })
    .catch(error => next(error))
})

actionsRouter.delete('/:id', async (request, response) => {
  const user = await User.findById(request.userId)
  const action = await Action.findById(request.params.id)
  if (action.user.toString() === request.userId ) {
    await Action.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
})

module.exports = actionsRouter