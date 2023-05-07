/*
 * ./src/app/models/note_model.js
 * This file contains Note database model.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Note = new Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  topics: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}],
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {
  timestamps: true,
});

module.exports = mongoose.model('Note', Note);
