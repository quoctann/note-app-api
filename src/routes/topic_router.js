/*
 * ./src/routes/topic_router.js
 * This file define routing for note topics, endpoint: localhost/topic/
 * Use this to define routing of note topics.
 */

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const topicController = require('../app/controllers/topic_controller');
const userIsLogged = require('../app/middleware/custom_middleware');
// const {check, body, validationResult} = require('express-validator');

// const validateGetAll = () => {
//   return [
//     body('title').notEmpty(),
//     body('description').notEmpty(),
//   ];
// };

// router.get('/', topicController.index);
router.post('/create-single', topicController.createSimpleTopic);
router.post('/add-note', topicController.addNoteToTopic);
router.get('/', topicController.getTopicWithPopulate);
// router.get('/all', validateGetAll(), topicController.getAll);
router.get('/all', userIsLogged, topicController.getAll);

module.exports = router;
