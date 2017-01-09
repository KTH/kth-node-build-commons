module.exports.isProduction = function (env) {
  return env === 'production' || gulpUtil.env.prod || process.env.NODE_ENV.startsWith('prod')
}

module.exports.isReference = function (env) {
  return env === 'reference' || gulpUtil.env.ref || process.env.NODE_ENV.startsWith('ref')
}

module.exports.isDevelopment =  function (env) {
  return env === 'development' || !isProduction(env) && !isReference(env)
}

module.exports.getEnvKey = function (env) {
  if (isProduction(env)) {
    return 'prod'
  } else if (isReference(env)) {
    return 'ref'
  } else {
    return 'dev'
  }
}

module.exports.onError = function (err) {
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