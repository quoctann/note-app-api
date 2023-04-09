/*
 * ./src/app/models/topic_model.js
 * This file contains Topic database model.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Topic = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  notes: {type: mongoose.Schema.Types.ObjectId, ref: 'Note'},
});

module.exports = mongoose.model('Topic', Topic);
