/*
 * ./src/app/controller/home_controller.js
 * This file contains homepage controller.
 * Use controller to handle client requests.
 */

const User = require('../models/user_model');
const Note = require('../models/note_model');
const Topic = require('../models/topic_model');

/**
 * Home controller
 */
class HomeController {
  /**
   * GET homepage
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   */
  async index(req, res, next) {
    if (req.session.userId) {
      // Load user notes and topics
      const userData = await User
          .findOne({uid: req.session.userId}, 'uid topics notes')
          .populate({
            path: 'notes',
            populate: {
              path: 'topics',
              select: {'_id': 1, 'title': 1},
            },
          })
          .populate({
            path: 'topics',
            populate: {
              path: 'notes',
              select: {'_id': 1},
            },
          })
          .exec();
      // console.log(userData);
      // Already logged in
      res.render('main_app',
          {username: req.session.username, isLogin: true, data: userData});
    } else {
      res.render('login', {title: 'Express', isLogin: false});
    }
  }
}

module.exports = new HomeController();
