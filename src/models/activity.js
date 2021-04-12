const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1
    },
    level: String,
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit'
    }
})

module.exports = mongoose.model('Activity', activitySchema)