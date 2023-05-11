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

      const relatedTopics = [];
      // Check if incoming string is not an array of MongoDB ObjectID,
      const requestTopics = (req.body['related-topics'].toString()).split(',');
      requestTopics.forEach((topic) => {
        if (mongoose.Types.ObjectId.isValid(topic)) {
          relatedTopics.push(topic);
        }
      });

      const {title, content} = {
        title: req.body.title,
        content: req.body.content};

      const note = new Note();
      note.title = title;
      note.content = content;
      note.user = user;

      if (relatedTopics.length > 0) {
        note.topics = relatedTopics;
      }

      // Create document with transaction
      const conn = mongoose.connection;
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
        if (relatedTopics.length > 0) {
          await Topic.updateMany({
            '_id': {$in: relatedTopics},
          }, {
            $addToSet: {notes: note._id},
          }, {
            new: true,
            useFindAndModify: false,
          });
        }
      });
      dbSession.endSession();

      return res.redirect('back');
    } catch (error) {
      console.log(error);
      return res.redirect('back');
    }
  }

  /**
   * [POST] Update single note by Note ObjectID
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   * @return {*} Return value
   */
  async update(req, res, next) {
    try {
      const objId = req.params.id;
      const note = await Note.findById(objId);
      const topicsBefore = note.topics;
      const relatedTopics = [];

      // Check if coming string is not an array of MongoDB ObjectID,
      const requestTopics = (req.body['update-related-topics']
          .toString()).split(',');
      requestTopics.forEach((topic) => {
        if (mongoose.Types.ObjectId.isValid(topic)) {
          relatedTopics.push(topic);
        }
      });

      note.title = req.body['title'];
      note.content = req.body['content'];

      if (relatedTopics.length > 0) {
        note.topics = relatedTopics;
      }

      // Transaction
      const conn = mongoose.connection;
      const dbSession = await conn.startSession();
      await dbSession.withTransaction(async () => {
        // Save note into database
        await note.save();

        // Add relative note list also
        await Topic.updateMany({
          '_id': {$in: note.topics},
        }, {
          $addToSet: {notes: note._id},
        }, {
          new: true,
          useFindAndModify: false,
        });

        const topicDiff = topicsBefore.filter((item) =>
          note.topics.indexOf(item) === -1);

        // And remove un-related anymore
        await Topic.updateMany({
          '_id': {$in: topicDiff},
        }, {
          $pull: {notes: note._id},
        }, {
          new: true,
          useFindAndModify: false,
        });
      });
      dbSession.endSession();

      return res.status(204).json({message: 'Updated'});
    } catch (error) {
      return res.status(500)
          .json({message: 'An error occurred', detail: error});
    }
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

      // Transaction
      const conn = mongoose.connection;
      const dbSession = await conn.startSession();
      await dbSession.withTransaction(async () => {
        const note = await Note.findById({_id: req.params.id});
        // Delete on relative topics
        await Topic.updateMany({
          '_id': {$in: note.topics},
        }, {
          $pull: {notes: note._id},
        }, {
          new: true,
          useFindAndModify: false,
        });

        // Delete on relative user's notes
        await User.findByIdAndUpdate(
            note.user,
            {
              $pull: {notes: note._id},
            }, {
              new: true,
              useFindAndModify: false,
            });

        // Delete note
        await note.deleteOne();
      });
      dbSession.endSession();

      return res.status(200).json({message: 'Note removed'});
    } catch (error) {
      return res.status(500).json({message: 'An error occur', err: error});
    }
  }
}

module.exports = new NoteController();
