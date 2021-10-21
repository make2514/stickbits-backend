const habitsRouter = require('express').Router()
const Habit = require('../models/habit')
const User = require('../models/user')
const Action = require('../models/action')

habitsRouter.get('/', async (request, response) => {
  const user = await User.findById(request.userId)
  const habits = await Habit.find().where('_id').in(user.habits);
  response.json(habits.map(habit => habit.toJSON()))
})

habitsRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.userId)
  const habit = await Habit.findById(request.params.id)
  if (habit && user && habit.user.toString() === user.id.toString() ) {
    response.json(habit.toJSON())
  }
})

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
    description,
    user: user._id
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

habitsRouter.delete('/:id', async (request, response) => {
  const user = await User.findById(request.userId)
  const habit = await Habit.findById(request.params.id)
  if (habit && user && habit.user.toString() === user.id.toString() ) {
    await Action.find({
      '_id': { $in: habit.actions}
    }).deleteMany()

    user.habits = user.habits.remove(habit._id)
    await user.save()

    await Habit.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(400).json({ error: 'Current user does not have right to delete this habit' })
  }
})

module.exports = habitsRouter