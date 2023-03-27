/*
 * ./src/routes/sample.js - This is routing for sample
 *
 * (C) 2023 Tan Tran Quoc <contact.tantranquoc@gmail.com>
 *
 * This code is licensed under MIT.
 */

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const sampleController = require('../app/controller/SampleController');

router.get('/', sampleController.index);

module.exports = router;
