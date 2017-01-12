module.exports = function (globals) {
  return {
    common: require('./common'),
    moveResources: require('./moveResources')(globals),
    sass: require('./sass')(globals),
    vendor: require('./vendor')(globals),
    webpack: require('./webpack')(globals),
    clean: require('./clean')(globals)
  }
}

