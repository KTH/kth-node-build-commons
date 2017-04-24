const del = require('del')

module.exports = function (globals) {
  return function () {
    // Performing this sync because we want to make sure nothing else is started
    // before this is completed
    // NOTE: config-*,js is here for legacy reasons, we shouldn't generate these any more
    // because config is passed through browserConfig endppoint these days.
    del.sync(['dist', 'public/js/app/config-*.js'])
  }
}
