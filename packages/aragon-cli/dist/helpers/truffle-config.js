'use strict'

var fs = require('fs')

var _require = require('../util')
var findProjectRoot = _require.findProjectRoot

var getTruffleConfig = function getTruffleConfig() {
  try {
    if (fs.existsSync(''.concat(findProjectRoot(), '/truffle.js'))) {
      var truffleConfig = require(''.concat(findProjectRoot(), '/truffle'))

      return truffleConfig
    }

    if (fs.existsSync(''.concat(findProjectRoot(), '/truffle-config.js'))) {
      var _truffleConfig = require(''.concat(
        findProjectRoot(),
        '/truffle-config.js'
      ))

      return _truffleConfig
    }
  } catch (err) {
    console.log(err) // This means you are running init

    return null
  }

  throw new Error("Didn't find any truffle.js file")
}

module.exports = {
  getTruffleConfig: getTruffleConfig,
}
// # sourceMappingURL=truffle-config.js.map
