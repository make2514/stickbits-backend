const mongoose = require('mongoose')

const actionSchema = new mongoose.Schema({
    level: String,
    name: String,
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: Date
})

module.exports = mongoose.model('Action', actionSchema)