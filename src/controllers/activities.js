const activitiesRouter = require('express').Router()
const Activity = require('../models/activity')
const Habit = require('../models/habit')

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
    level
  })

  const savedActivity = await activity.save()
  habit.activities = habit.activities.concat(savedActivity._id)
  await habit.save()

  response.json(savedActivity.toJSON())
})

activitiesRouter.put('/:id', (request, response, next) => {
  const id = request.params.id;
  const { name } = request.body

  const activity = {
    name
  }

  Activity.findByIdAndUpdate(id, activity, { new: true })
    .then(updatedActivity => {
      response.json(updatedActivity.toJSON())
    })
    .catch(error => next(error))
})

module.exports = activitiesRouter