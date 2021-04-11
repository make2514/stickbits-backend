const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1
    },
    level: String
})

module.exports = mongoose.model('Activity', activitySchema)