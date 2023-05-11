/*
 * ./src/helper/handlebars_helper.js
 * This file contains customize Handlebars helper.
 * Use helper to modify DOM for client.
 *
 * NOTE: use regular Function Expression (not Arrow one) to implement
 * registerHelper, because arrow function doesn't have "this" context
 */

const hbs = require('hbs');
const moment = require('moment');

/**
 * Invoke customize Handlebars helpers
 */
function register() {
  // Normalize Topic objects array to safe display on UI
  hbs.registerHelper('normalizePopulatedTopics', function(topics) {
    /* Sample Topic objects was return by controller:
    *
    * [ {_id: new ObjectID("bla bla 1"), title: "some text 1"},
    *   {_id: new ObjectID("bla bla n"), title: "some text n"} ]
    *
    * This should be normalize as safe string format to rendering on UI
    */

    if (undefined === topics || null === topics ||
      '' === topics || [] === topics) {
      return;
    };

    let idListSafeString = '';
    topics.forEach((topic) => {
      idListSafeString += topic._id + ',';
      // console.log(topic, typeof(topic));
    });

    return new hbs.SafeString(idListSafeString);
  });

  // Generate random Bootstrap 5 theme color HTML class name
  hbs.registerHelper('randomLightTheme', function(prefix) {
    // Not include 'light' because not clearly displaying with white text
    const bootstrapTheme = ['primary', 'secondary', 'success', 'danger',
      'warning', 'info', 'dark'];
    // eslint-disable-next-line max-len
    const randomIdx = Math.floor(Math.random() * (bootstrapTheme.length - 0) + 0);

    return new hbs.SafeString(prefix + '-' + bootstrapTheme[randomIdx]);
  });

  // Format a date string get from mongoose to readable date string
  hbs.registerHelper('moment', function(timestamps) {
    moment.locale('vi');
    const aWeekAgo = moment().subtract(7, 'days').startOf('day');
    // If within a week, rendering a 'sometimes from now' date string
    if (moment(timestamps).isAfter(aWeekAgo)) {
      // console.log(moment().toString());
      return new hbs.SafeString(moment(timestamps).fromNow());
    } else {
      return new hbs.SafeString(moment(timestamps)
          .format('DD/MMM/YYYY HH:MM'));
    };
  });

  // Count array length
  hbs.registerHelper('arrayLength', function(arr) {
    if (undefined === arr || null === arr) {
      return '0';
    }
    return arr.length;
  });
};

module.exports = {
  register,
};
