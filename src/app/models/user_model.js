/*
 * ./src/app/models/user_model.js
 * This file contains User model.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

const User = new Schema({
  uid: {type: String, default: shortid.generate},
  username: {type: String, maxLength: 255, required: true},
  password: {type: String, maxLength: 255, required: true},
  notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
  topics: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}],
});

module.exports = mongoose.model('User', User);
