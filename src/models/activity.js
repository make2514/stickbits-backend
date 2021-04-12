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
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    archive: Boolean
})

module.exports = mongoose.model('Activity', activitySchema)