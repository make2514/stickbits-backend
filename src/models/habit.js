const mongoose = require('mongoose')

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

habitSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Habit', habitSchema)
