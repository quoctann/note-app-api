/*
 * ./src/routes/index.js
 * This is the routing entry point.
 * Use this point to define other routing level.
 */

// Router for sample
const sampleRouter = require('./sample');

/**
 * Request URL will be matched with router definition on top-down order.
 * Because of that, the last router definition should be '/' as the application
 * entry endpoint (not required but usually).
 * Depending on configuration, the request will be routing to corresponding
 * router for business processing.
 * @param {Express} app Instance of Express
 */
function route(app) {
  app.use('/', sampleRouter);
}

module.exports = route;
