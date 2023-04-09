// Helper to validate user
const userIsLogged = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    return res.status(403).render('/', {message: 'Unauthorized'});
  }
};

module.exports = userIsLogged;
