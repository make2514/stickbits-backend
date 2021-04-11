const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3
  },
  name: String,
  password: {
    type: String,
    minlength: 7
  },
  habits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit'
  }]
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User