/*
 * ./src/app/controller/SampleController.js
 * This file contains example controller.
 * Use controller to handle client requests.
 */

/**
 * Sample controller
 */
class SampleController {
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

module.exports = new SampleController();
