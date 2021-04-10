const config = require('./config/config')
const express = require('express')
const mongoose = require('mongoose');
mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected');
});