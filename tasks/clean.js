const del = require('del')

module.exports = function () {
  // Performing this sync because we want to make sure nothing else is started
  // before this is completed
  del.sync(['dist', 'public/js/app/config-*.js'])
}
