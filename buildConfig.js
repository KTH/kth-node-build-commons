'use strict'
const configurator = require('kth-node-configuration')
const path = require('path')
let paths

module.exports = {
  setPaths (_paths) {
    paths = _paths
  },
  createFile (configBasePath) {
    /*
      This builds the file public/js/app/config.js with
      safe configuration content
    */

    configBasePath = configBasePath || './config'

    ;['prod', 'ref', 'dev'].forEach(env => {
      process.env.NODE_ENV = env

      const tmpConfig = {
        local: require(path.join(configBasePath, '/localSettings'))
      }

      // Optionally add common-, dev-, ref- and prodSettings if the file exists
      const optionalSettings = [
        { 'name': 'default', path: path.join(configBasePath, '/commonSettings') },
        { 'name': 'ref', path: path.join(configBasePath, '/refSettings') },
        { 'name': 'prod', path: path.join(configBasePath, '/prodSettings') },
        { 'name': 'dev', path: path.join(configBasePath, '/devSettings') }
      ]
      
      optionalSettings.forEach((item) => {
        try {
          tmpConfig[item.name] = require(item.path)
        } catch (err) {
          // Do nothing with optional xxxSettings.js files that don't exist
        }
      })

      // Now we have added these settings and can generate the config-xxx.js file
      const config = configurator(tmpConfig)
      const safeConf = config.safe()
      
      const fs = require('fs')
      const stream = fs.createWriteStream(`public/js/app/config-${env}.js`)

      const conf = JSON.stringify({ config: safeConf, paths: paths }, null, 2)
      const fileContent = `module.exports = ${conf}
`
      stream.once('open', function (fd) {
        stream.write(fileContent)
        stream.end()
      })
    })
  }
}
