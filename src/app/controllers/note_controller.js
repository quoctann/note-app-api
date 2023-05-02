/*
 * ./src/app/controller/note_controller.js
 * This file contains Note controller.
 * Use controller to handle client requests.
 */

const mongoose = require('mongoose');
const Note = require('../models/note_model');
const Topic = require('../models/topic_model');
const User = require('../models/user_model');

/**
 * Note controller
 */
class NoteController {
  /**
   * GET
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   */
  index(req, res, next) {
    res.render('index', {title: 'Express'});
  }

  /**
   * METHOD
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   * @return {*} Return value
   */
  getAllByUser(req, res, next) {
    // HTTP Not Modified
    return res.status(304);
  }

  /**
   * METHOD
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   * @return {*} Return value
   */
  async create(req, res, next) {
    try {
      // Only authenticated user can perform
      if (!req.session.userId) {
        return res.status(403).json({message: 'User un-authenticated'});
      }

      const user = await User.findOne({uid: req.session.userId}).exec();
      if (!user) {
        return res.status(500)
            .json({message: 'User not found, internal error'});
      }

      const relatedTopics = req.body['related-topics'];

      const {title, content} = {
        title: req.body.title,
        content: req.body.content};

      const note = new Note({
        title: title,
        content: content,
        user: user,
        topics: relatedTopics,
      });

      // Create documents with transaction
      const conn = await mongoose.connection;
      const dbSession = await conn.startSession();
      await dbSession.withTransaction(async () => {
        // Create note with relative user
        await note.save();

        // Update user note list also
        await User.findByIdAndUpdate(
            user._id,
            {$addToSet: {notes: note._id}},
            {new: true, useFindAndModify: false},
        );

        // Update relative note list also
        // filter - update
        await Topic.updateMany({
          '_id': {$in: relatedTopics},
        }, {
          $addToSet: {notes: note._id},
        }, {
          new: true,
          useFindAndModify: false,
        });
      });
      dbSession.endSession();

      return res.status(201).redirect('/');
    } catch (error) {
      console.log(error);
      return res.status('500').render('main_app',
          {message: `Create failed \n ${error}`});
    }
  }

  /**
   * [POST] Update single note by Note ObjectID
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   * @return {*} Return value
   */
  update(req, res, next) {
    // HTTP Not Modified
    return res.status(304);
  }

  /**
   * [DELETE] Delete a note document by Object ID
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   * @return {*} Return value
   */
  async delete(req, res, next) {
    try {
      if (!req.params) {
        return res.status(400).json({message: 'Bad request, no params passed'});
      }
      // Hard delete a document by this Object ID
      await Note.deleteOne({_id: req.params.id});
      return res.status(200).json({message: 'Note removed'});
    } catch (error) {
      return res.status(500).json({message: 'An error occur', err: error});
    }
  }
}

module.exports = new NoteController();
