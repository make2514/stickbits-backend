const habitsRouter = require('express').Router()
const Habit = require('../models/habit')
const User = require('../models/user')

habitsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findById(request.userId)

  const { name, description } = body

  if (!name) {
    response.status(400).end()
    return
  }

  const habit = new Habit({
    name,
    description
  })

  const savedHabit = await habit.save()
  user.habits = user.habits.concat(savedHabit._id)
  await user.save()

  response.json(savedHabit.toJSON())
})

habitsRouter.put('/:id', (request, response, next) => {
  const id = request.params.id;
  const { name, description } = request.body

  const habit = {
    name,
    description
  }

  Habit.findByIdAndUpdate(id, habit, { new: true })
    .then(updatedHabit => {
      response.json(updatedHabit.toJSON())
    })
    .catch(error => next(error))
})

module.exports = habitsRouter