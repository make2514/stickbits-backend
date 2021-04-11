const mongoose = require('mongoose');

const config = require('./config/config')
const app = require('./app');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(config.PORT, () => {
        console.log('listening to port ' + config.PORT)
    });
  })
  .catch(error => {
    console.log('error connection to MongoDB:', error.message)
  })