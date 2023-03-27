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
