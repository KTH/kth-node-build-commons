module.exports = function (globals) {
  return {
    moveResources: require('./moveResources')(globals),
    sass: require('./sass')(globals),
    vendor: require('./vendor')(globals),
    webpack: require('./webpack')(globals),
    clean: require('./clean')(globals)
  }
}

