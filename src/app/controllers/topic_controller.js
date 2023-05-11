/*
 * ./src/app/controller/topic_controller.js
 * This file contains Topic controller.
 * Use controller to handle client requests.
 */

const mongoose = require('mongoose');
const Note = require('../models/note_model');
const Topic = require('../models/topic_model');
const User = require('../models/user_model');

/**
 * Topic controller
 */
class TopicController {
  /**
   * [GET]
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
  getLimitRecords(req, res, next) {
  // HTTP Not Modified
    return res.status(304);
  }

  /**
   * [GET] Get all topics
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   * @return {*} Return value
   */
  async getAll(req, res, next) {
    const userData = await User.findOne({uid: req.session.userId}, 'uid topics')
        .populate('topics');
    return res.status(200).json(userData);
  }

  /**
 * [POST] Create single, simple Topic document (title, description)
 * @param {*} req Body should contains "title", "description"
 * @param {*} res HTTP 200 and Topic json data if success, otherwise HTTP 400
 * @param {*} next Next middleware
 */
  async createSimpleTopic(req, res, next) {
    try {
      const {title, description} = {
        title: req.body.title,
        description: req.body.description};

      const topic = new Topic({
        title: title,
        description: description,
      });

      const resultTopic = await topic.save();

      // Update user topics list for get all by users
      const user = await User.findOne({uid: req.session.userId}).exec();
      await User.findByIdAndUpdate(
          user._id,
          {$addToSet: {topics: resultTopic._id}},
          {new: true, useFindAndModify: false},
      );

      return res.redirect('/');
    } catch (error) {
      console.log(error);
      return res.redirect('/');
    }
  }

  /**
   * [POST] Add Note into Topic object reference for 2 way binding
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next
   */
  async addNoteToTopic(req, res, next) {
    const {topicId, note} = {
      topicId: req.body.topicId,
      note: req.body.note,
    };

    // Use $addToSet instead of $push prevent duplicate on ref
    const value = await Topic.findByIdAndUpdate(
        topicId,
        {$addToSet: {notes: note._id}},
        {new: true, useFindAndModify: false},
    );
    if (value) {
      return res.status(201).json(value);
    } else {
      return res.status(400);
    }
  }

  /**
   * [GET] Get all relative notes by given topics data (populate data)
   * @param {*} req Request contains query: topicId = Topic Object ID
   * @param {*} res Response that contains json data depending on Topic _id
   * @param {*} next Nex middleware
   * @return {*} HTTP 200 and json data if success, otherwise HTTP 400
   */
  async getTopicWithPopulate(req, res, next) {
    try {
      const value = await Topic
          .findById(req.query.topicId)
          .populate({
            path: 'notes',
            populate: {
              path: 'topics',
              select: {'_id': 1, 'title': 1},
            },
          });
      if (value) {
        return res.status(201).json(value);
      } else {
        return res.status(400).json({message: 'An error occurred'});
      }
    } catch (error) {
      return res.status(500)
          .json({message: 'Un-expected error occurred', error: error});
    }
  }

  /**
 * [PUT] Update single topic
 * @param {*} req Request
 * @param {*} res Respond
 * @param {*} next Next
 * @return {*} Return value
 */
  async update(req, res, next) {
    try {
      const objId = req.params.id;
      const topic = await Topic.findById(objId);
      topic.title = req.body['title'];
      topic.description = req.body['description'];
      await topic.save();
      return res.status(204).json({message: 'Updated'});
    } catch (error) {
      return res.status(500).json({message: 'An error occurred'});
    }
  }

  /**
 * [DELETE] Delete a Topic
 * @param {*} req Request
 * @param {*} res Respond
 * @param {*} next Next
 * @return {*} Return value
 */
  async delete(req, res, next) {
    try {
      const objId = req.params.id;
      const topic = await Topic.findById(objId);

      /* Delete topic
       * Delete user's topic
       * Delete note's topic (keep that note, just remove array item)
       */
      const conn = mongoose.connection;
      const dbSession = await conn.startSession();
      await dbSession.withTransaction(async () => {
        // Remove related on User
        await User.updateOne({
          'uid': req.session.userId,
        }, {
          $pull: {topics: topic._id},
        });

        // Remove related on Note
        await Note.updateMany({
          'topics': topic._id,
        }, {
          $pull: {topics: topic._id},
        });

        // Delete topic
        await topic.deleteOne();
      });
      dbSession.endSession();

      return res.status(200).json({message: 'Topic removed'});
    } catch (error) {
      return res.status(500)
          .json({message: 'An error occurred', detail: error});
    }
  }
}

module.exports = new TopicController();
