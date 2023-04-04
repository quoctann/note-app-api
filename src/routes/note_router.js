/*
 * ./src/routes/note_router.js
 * This file define routing taking notes
 * Use this to define routing for Note data.
 */

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const noteController = require('../app/controllers/note_controller');

router.get('/', noteController.index);

module.exports = router;
