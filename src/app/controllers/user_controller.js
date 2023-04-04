/*
 * ./src/app/controller/user_controller.js
 * This file contains User controller.
 * Use controller to handle client requests.
 */

const User = require('../models/user_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * User controller
 */
class UserController {
  /**
   * GET retrieve public user content
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   */
  index(req, res, next) {
    res.render('index', {title: 'Express'});
  }

  /**
   * POST perform user login action, give them jwt to authenticate
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   * @return {*} Response
   */
  async login(req, res, next) {
    try {
      const user = await User.findOne({username: req.body.username});

      if (user) {
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          if (result) {
            // Valid user
            return res
                .json({token: jwt.sign({user: user.username}, JWT_SECRET,
                    {expiresIn: '2h'}),
                });
          }
        });
      } else {
        // Un-valid user
        return res
            .status(401)
            .json({
              message: 'The username and password your provided are invalid',
            });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * POST perform user register action
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   * @return {*} Response
   */
  register(req, res, next) {
    let hashPassword = '';
    const salt = bcrypt.genSaltSync(10);
    hashPassword = bcrypt.hashSync(req.body.password, salt);

    const user = new User({
      username: req.body.username,
      password: hashPassword,
    });

    user.save()
        .then(() => res.status(201).json(user))
        .catch((error) => {
          console.log(error);
          return res.status(400);
        });

    return res.status(500);
  }

  /**
   * POST perform user logout action
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   */
  logout(req, res, next) {
    res.render('index', {title: 'Express'});
  }

  /**
   * GET test authentication get secure resource
   * @param {*} req Request
   * @param {*} res Respond
   * @param {*} next Next
   * @return {*} Secure resources
   */
  test(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({error: 'Not Authorized'});
    }

    // Bearer token
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    try {
      // Verify the token is valid
      const {user} = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({
        // eslint-disable-next-line max-len
        message: `Congrats ${user}! You can now access the super secret resource`,
      });
    } catch (error) {
      return res.status(401).json({error: 'Not Authorized'});
    }
  }
}

module.exports = new UserController();