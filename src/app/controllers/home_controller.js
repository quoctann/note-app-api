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
    res.render('index', {title: 'Express'});
  }
}

module.exports = new HomeController();
