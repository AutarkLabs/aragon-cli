'use strict'

var path = require('path')

var fs = require('fs-extra')

var _require = require('../util')
var findProjectRoot = _require.findProjectRoot

module.exports = function moduleMiddleware(argv) {
  var runsInCwd = argv['_'] === 'init'

  if (!runsInCwd) {
    try {
      var modulePath = path.resolve(findProjectRoot(), 'arapp.json')
      var arapp = fs.readJsonSync(modulePath)

      var Ajv = require('ajv')

      var arappSchema = require('../../schemas/arapp.schema')

      var ajv = new Ajv({
        allErrors: true,
      })
      var validate = ajv.compile(arappSchema)
      var valid = validate(arapp)

      if (!valid) {
        var errors = ajv.errorsText(validate.errors, {
          dataVar: 'arapp',
        })
        argv.reporter.error(
          'Error parsing the aragon config file: '.concat(errors, '!')
        )
        process.exit(1)
      } // hack: we need to access the module in downstream middleware (environmentMiddleware), but
      // yargs does not update the `argv` param until all middleware have
      // ran, so we directly mutate the `argv` param
      // https://github.com/yargs/yargs/issues/1232

      argv.module = arapp
    } catch (err) {
      // argv.reporter.debug(err)
    }
  }

  return {}
}
// # sourceMappingURL=module.js.map
