const activitiesRouter = require('express').Router()
const Activity = require('../models/activity')
const Habit = require('../models/habit')
const User = require('../models/user')

activitiesRouter.get('/:habitId', async (request, response) => {
  const user = await User.findById(request.userId)
  const habit = await Habit.findById(request.params.habitId)
  if (habit && user && habit.user.toString() === user.id.toString() ) {
    const activities = await Activity.find({habit: request.params.habitId})
    response.json(activities.map(activity => activity.toJSON()))
  }
})

activitiesRouter.post('/', async (request, response) => {
  const { name, level, habitId } = request.body
  // TODO: Add error handler when habit is not found
  const habit = await Habit.findById(habitId)
  console.log(habitId, habit, habit.activities);
  if (!name || !level) {
    response.status(400).end()
    return
  }

  const activity = new Activity({
    name,
    level,
    habit: habit._id
  })

  const savedActivity = await activity.save()
  habit.activities = habit.activities.concat(savedActivity._id)
  await habit.save()

  response.json(savedActivity.toJSON())
})

activitiesRouter.put('/:id', (request, response, next) => {
  // TODO: Add authorization to this API
  const id = request.params.id;

  Activity.findByIdAndUpdate(id, request.body, { new: true })
    .then(updatedActivity => {
      response.json(updatedActivity.toJSON())
    })
    .catch(error => next(error))
})

module.exports = activitiesRouter