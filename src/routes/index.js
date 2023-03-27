/*
 * ./src/routes/index.js - This is the rounting entry point
 *
 * (C) 2023 Tan Tran Quoc <contact.tantranquoc@gmail.com>
 *
 * This code is licensed under MIT.
 */

// Router for sample
const sampleRouter = require('./sample');

/**
 * Request URL will be matched with router definition on top-down order.
 * Because of that, the last router definition should be '/' as the application
 * entry endpoint (not required but ussually).
 * Depending on cofiguration, the request will be routing to corresponding
 * router for business processing.
 * @param {Express} app Instance of Express
 */
function route(app) {
  app.use('/', sampleRouter);
}

module.exports = route;
