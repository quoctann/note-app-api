/*
 * ./src/config/database/index.js
 * This file contains database configuration.
 * Connect to MongoDB.
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 */
async function connect() {
  try {
    // 'mongodb://localhost:27017/note-app'
    const mongoDbUri = process.env.MONGODB_URI;

    await mongoose.connect(mongoDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connect successfully!');
  } catch (error) {
    console.log(error);
  }
}

module.exports = {connect};
