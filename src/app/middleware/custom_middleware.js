// Helper to validate user
const userIsLogged = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    return res.status(403)
        .render('login', {message: 'Please login to continue using'});
  }
};

module.exports = userIsLogged;
