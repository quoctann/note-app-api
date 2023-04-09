/*
 * ./src/app/controller/note_controller.js
 * This file contains Note controller.
 * Use controller to handle client requests.
 */

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

      const {title, content} = {
        title: req.body.title,
        content: req.body.content};

      const note = new Note({
        title: title,
        content: content,
        user: user,
      });

      // Create note with relative user
      await note.save();

      // Update user note list also
      await User.findByIdAndUpdate(
          user._id,
          {$addToSet: {notes: note._id}},
          {new: true, useFindAndModify: false},
      );

      return res.status(201).redirect('/');
    } catch (error) {
      console.log(error);
      return res.status('500').render('main_app',
          {message: `Create failed \n ${error}`});
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

module.exports = new NoteController();
