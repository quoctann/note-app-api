/*
 * ./src/routes/sample.js
 * This file define routing for example
 * Use this example to define other routing files.
 */

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const sampleController = require('../app/controllers/SampleController');

router.get('/', sampleController.index);

module.exports = router;
