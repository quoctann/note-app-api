/*
 * ./src/routes/note_router.js
 * This file define routing taking notes
 * Use this to define routing for Note data.
 */

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const noteController = require('../app/controllers/note_controller');
const userIsLogged = require('../app/middleware/custom_middleware');

router.get('/', noteController.index);
router.post('/create', userIsLogged, noteController.create);
router.delete('/:id', userIsLogged, noteController.delete);
router.put('/:id', userIsLogged, noteController.update);

module.exports = router;
