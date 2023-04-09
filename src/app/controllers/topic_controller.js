/*
 * ./src/app/controller/topic_controller.js
 * This file contains Topic controller.
 * Use controller to handle client requests.
 */

const Note = require('../models/note_model');
const Topic = require('../models/topic_model');

/**
 * Topic controller
 */
class TopicController {
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
  getLimitRecords(req, res, next) {
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
  getAll(req, res, next) {
    // HTTP Not Modified
    return res.status(304);
  }

  /**
 * METHOD
 * @param {*} req Request
 * @param {*} res Respond
 * @param {*} next Next
 */
  createSimpleTopic(req, res, next) {
    const {title, description} = {
      title: req.body.title,
      description: req.body.description};

    const topic = new Topic({
      title: title,
      description: description,
    });

    topic.save()
        .then(() => res.status(201).json(topic))
        .catch((error) => {
          console.log(error);
          return res.status(400);
        });

    if (req.body.topics) {
      // Create note with topics

    } else {

    }
  }

  /**
   * POST add Note into Topic object reference for 2 way binding
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
  // get notes by topic id
  async getTopicWithPopulate(req, res, next) {
    const value = await Topic.findById(req.query.topicId).populate('notes');
    if (value) {
      return res.status(201).json(value);
    } else {
      return res.status(400);
    }
  }
  /**
 * METHOD
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
 * METHOD
 * @param {*} req Request
 * @param {*} res Respond
 * @param {*} next Next
 * @return {*} Return value
 */
  delete(req, res, next) {
  // HTTP Not Modified
    return res.status(304);
  }
}

module.exports = new TopicController();
