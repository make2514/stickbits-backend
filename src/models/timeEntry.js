const mongoose = require('mongoose')

const timeEntrySchema = new mongoose.Schema({
    level: String,
    action: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Action'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: Date
})

module.exports = mongoose.model('TimeEntry', timeEntrySchema, 'TimeEntry')