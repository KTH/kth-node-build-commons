const gulpUtil = require('gulp-util')
const growly = require('growly')
const notify = require('gulp-notify')
const { safeGet } = require('safe-utils')

const isProduction = function (env) {
  return safeGet(() => env.startsWith('prod')) || gulpUtil.env.production || safeGet(() => process.env.NODE_ENV.startsWith('prod'))
}

const isReference = function (env) {
  return safeGet(() => env.startsWith('ref')) || gulpUtil.env.reference || safeGet(() => process.env.NODE_ENV.startsWith('ref'))
}

const isDevelopment = function (env) {
  return safeGet(() => env.startsWith('dev')) || !isProduction(env) && !isReference(env)
}

const getEnvKey = function (env) {
  if (isProduction(env)) {
    return 'prod'
  } else if (isReference(env)) {
    return 'ref'
  } else {
    return 'dev'
  }
}

const onError = function (err) {
  console.log('err', err)
  growly.notify('Gulp failed!' + err)
  notify.onError({
    title: 'Gulp',
    subtitle: 'Failure!',
    message: 'Error: <%= error.message %>',
    sound: 'Beep'
  })(err)

  this.emit('end')
}

module.exports = {
  isProduction: isProduction,
  isReference: isReference,
  isDevelopment: isDevelopment,
  onError: onError,
  getEnvKey: getEnvKey
}
