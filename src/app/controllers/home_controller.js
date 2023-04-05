/*
 * ./src/app/controller/home_controller.js
 * This file contains homepage controller.
 * Use controller to handle client requests.
 */

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
  index(req, res, next) {
    if (req.session.userId) {
      // Already logged in
      res.render('main_app', {username: req.session.username, isLogin: true});
    } else {
      res.render('login', {title: 'Express', isLogin: false});
    }
  }
}

module.exports = new HomeController();
