const mongoose = require('mongoose')

const actionSchema = new mongoose.Schema({
    level: String,
    name: String,
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit'
    },
    // TODO: Save as timestamp which might be useful later on to create timeline or some further analytics of the habit
    date: Date
})

module.exports = mongoose.model('Action', actionSchema)