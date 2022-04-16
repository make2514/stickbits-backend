const mongoose = require('mongoose')
const Action = require('../models/action')
const TimeEntry = require('../models/timeEntry')

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1
  },
  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

habitSchema.virtual('actions', {
  ref: 'Action',
  localField: '_id',
  foreignField: 'habit'
});

habitSchema.set('toJSON', {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

habitSchema.pre("deleteOne", { document : true }, async function(next) {
  const actions = await Action.find().where('habit').in(this._id);
  
  await TimeEntry.find().where('action').in(actions.map(action => action._id)).deleteMany();
  await Action.deleteMany({ habit: this._id });
  next();
});

/*
async next => {
  const actions = await Action.find().where('habit').in(habit._id);
  
  await TimeEntry.find().where('action').in(actions.map(action => action._id));
  Action.deleteMany({ habit: this._id }).exec();
  categoryModel.remove({ user: this._id }).exec();

  next();
}
*/

module.exports = mongoose.model('Habit', habitSchema, 'Habit')
