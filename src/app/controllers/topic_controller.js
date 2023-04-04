/*
 * ./src/app/controller/topic_controller.js
 * This file contains Topic controller.
 * Use controller to handle client requests.
 */

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
 * @return {*} Return value
 */
  create(req, res, next) {
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
