const actionsRouter = require('express').Router()
const Action = require('../models/action')
const Habit = require('../models/habit')
const User = require('../models/user')

actionsRouter.get('/:habitId', async (request, response) => {
  const user = await User.findById(request.userId)
  const habit = await Habit.findById(request.params.habitId)
  if (habit && user && habit.user.toString() === user.id.toString() ) {
    const actions = await Action.find({habit: request.params.habitId})
    response.json(actions.map(action => action.toJSON()))
  }
})

actionsRouter.post('/', async (request, response) => {
  const { name, level, habitId } = request.body
  // TODO: Add error handler when habit is not found
  const habit = await Habit.findById(habitId)
  console.log(habitId, habit, habit.actions);
  if (!name || !level) {
    response.status(400).end()
    return
  }

  const action = new Action({
    name,
    level,
    habit: habit._id
  })

  const savedAction = await action.save()
  habit.actions = habit.actions.concat(savedAction._id)
  await habit.save()

  response.json(savedAction.toJSON())
})

actionsRouter.put('/:id', (request, response, next) => {
  // TODO: Add authorization to this API
  const id = request.params.id;

  Action.findByIdAndUpdate(id, request.body, { new: true })
    .then(updatedAction => {
      response.json(updatedAction.toJSON())
    })
    .catch(error => next(error))
})

module.exports = actionsRouter