const habitsRouter = require('express').Router()
const Habit = require('../models/habit')
const User = require('../models/user')
const Action = require('../models/action')

const { endOfDay } = require('date-fns')
const { startOfDay } = require('date-fns')
const { addBusinessDays } = require('date-fns')

habitsRouter.get('/', async (request, response) => {
  const { endDate } = request.query;
  const { startDate } = request.query;
  let habits = await Habit
    .find().where('user')
    .in(request.userId)
    .populate({ 
      path: 'actions',
      populate: {
        path: 'timeEntries',
        match: {
          date: {
            $gte: startOfDay(new Date(startDate)),
            $lte: endOfDay(new Date(endDate))
          }
        }
      }
    })
  response.json(habits)
})

habitsRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.userId)
  let habit = await Habit.findById(request.params.id).lean()
  if (habit && user && habit.user.toString() === user.id.toString() ) {
    habit = await Habit.findById(request.params.id)
      .populate({ 
        path: 'actions',
        // TODO: get timeEntries within a period of time
        populate: {
          path: 'timeEntries'
        }
    })
    response.json(habit)
  } else if (!habit) {
    return response.status(400).json({ error: 'No habit found having this action' })
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
    await habit.deleteOne({'_id': request.params.id})
    response.status(204).end()
  } else {
    return response.status(400).json({ error: 'Current user does not have right to delete this habit' })
  }
})

module.exports = habitsRouter