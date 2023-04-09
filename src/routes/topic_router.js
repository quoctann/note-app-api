/*
 * ./src/routes/topic_router.js
 * This file define routing for note topics
 * Use this to define routing of note topics.
 */

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const topicController = require('../app/controllers/topic_controller');

// router.get('/', topicController.index);
router.post('/create', topicController.createSimpleTopic);
router.post('/add-note', topicController.addNoteToTopic);
router.get('/', topicController.getTopicWithPopulate);

module.exports = router;
