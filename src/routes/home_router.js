/*
 * ./src/routes/home_router.js
 * This file define routing for entry point of application
 * Use this as example to define other routing files.
 */

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const homeController = require('../app/controllers/home_controller');
const userIsLogged = require('../app/middleware/custom_middleware');

router.get('/', userIsLogged, homeController.index);

module.exports = router;
