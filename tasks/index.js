module.exports = function (globals) {
  return {
    sass: require('./sass')(globals),
    vendor: require('./vendor')(globals),
    webpack: require('./webpack')(globals),
    clean: require('./clean')(globals)
  }
}

