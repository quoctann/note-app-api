/*
 * ./src/routes/user_router.js
 * This file define routing for path host.domain/user/
 * Use this configuration to define User routing.
 */

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const userController = require('../app/controllers/user_controller');

router.get('/', userController.index);
router.get('/secure', userController.test);
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
