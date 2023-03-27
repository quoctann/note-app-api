/*
 * ./src/config/database/index.js - Database configuration
 * Connect to MongoDB
 *
 * (C) 2023 Tan Tran Quoc <contact.tantranquoc@gmail.com>
 *
 * This code is licensed under MIT.
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 */
async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/note-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connect successfully!');
  } catch (error) {
    console.log(error);
  }
}

module.exports = {connect};
