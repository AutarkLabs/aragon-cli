'use strict'

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('regenerator-runtime/runtime')

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg)
    var value = info.value
  } catch (error) {
    reject(error)
    return
  }
  if (info.done) {
    resolve(value)
  } else {
    Promise.resolve(value).then(_next, _throw)
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this
    var args = arguments
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args)
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value)
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
      }
      _next(undefined)
    })
  }
}

var fs = require('fs')

var findUp = require('find-up')

var semver = require('semver')

exports.command = 'version [bump]'
exports.describe = '(deprecated) Bump the application version'

exports.builder = function(yargs) {
  return yargs.positional('bump', {
    description: 'Type of bump (major, minor or patch) or version number',
    type: 'string',
    default: '1.0.0',
  })
} // TODO: Fix always default bump when network is not development

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee(_ref) {
        var reporter, bump, cwd, manifestLocation, manifest
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                ;(reporter = _ref.reporter),
                  (bump = _ref.bump),
                  (cwd = _ref.cwd)
                _context.next = 3
                return findUp('arapp.json', {
                  cwd: cwd,
                })

              case 3:
                manifestLocation = _context.sent
                manifest = JSON.parse(fs.readFileSync(manifestLocation))

                if (!manifest.environments) {
                  _context.next = 7
                  break
                }

                throw new Error(
                  'Deprecated: Your arapp.json contains an `environments` which no longer requires a `version` set in arapp.json.'
                )

              case 7:
                manifest.version = semver.valid(bump)
                  ? semver.valid(bump)
                  : semver.inc(manifest.version, bump)

                if (manifest.version) {
                  _context.next = 10
                  break
                }

                throw new Error(
                  'Invalid bump. Please use a version number or a valid bump (major, minor or patch)'
                )

              case 10:
                fs.writeFileSync(
                  manifestLocation,
                  JSON.stringify(manifest, null, 2)
                )
                reporter.success('New version: '.concat(manifest.version))
                process.exit()

              case 13:
              case 'end':
                return _context.stop()
            }
          }
        }, _callee)
      })
    )

    return function(_x) {
      return _ref2.apply(this, arguments)
    }
  })()
// # sourceMappingURL=version.js.map
