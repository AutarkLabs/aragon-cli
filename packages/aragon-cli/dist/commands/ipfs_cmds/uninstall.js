'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.join')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('regenerator-runtime/runtime')

var _listr = _interopRequireDefault(require('listr'))

var _execa = _interopRequireDefault(require('execa'))

var _chalk = _interopRequireDefault(require('chalk'))

var _inquirer = _interopRequireDefault(require('inquirer'))

var _listrOptions = _interopRequireDefault(
  require('@aragon/cli-utils/src/helpers/listr-options')
)

var _util = require('../../util')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

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

exports.command = 'uninstall'
exports.describe = 'Uninstall the go-ipfs binaries.'

exports.builder = function(yargs) {
  return yargs
    .option('local', {
      description: 'Whether to uninstall IPFS from the project dependencies',
      boolean: true,
      default: false,
    })
    .option('skip-confirmation', {
      description: 'Whether to skip the confirmation step',
      boolean: true,
      default: false,
    })
}

var runUninstallTask = function runUninstallTask(_ref) {
  var silent = _ref.silent
  var debug = _ref.debug
  var local = _ref.local
  return new _listr['default'](
    [
      {
        title: 'Uninstall IPFS',
        task: (function() {
          var _task2 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee(_task) {
              var npmBinary, npmArgs, logPrefix, uninstallProcess
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      npmBinary = (0, _util.getNodePackageManager)()
                      npmArgs = ['uninstall', 'go-ipfs']

                      if (!local) {
                        npmArgs.push('--global')
                      }

                      logPrefix = 'npm '.concat(npmArgs.join(' '), ':')
                      uninstallProcess = (0, _execa['default'])(
                        npmBinary,
                        npmArgs
                      )
                      uninstallProcess.stdout.on('data', function(log) {
                        if (log)
                          _task.output = ''.concat(logPrefix, ' ').concat(log)
                      })
                      _context.next = 8
                      return uninstallProcess

                    case 8:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee)
            })
          )

          function task(_x) {
            return _task2.apply(this, arguments)
          }

          return task
        })(),
      },
    ],
    (0, _listrOptions['default'])(silent, debug)
  ).run()
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref3 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee2(_ref2) {
        var debug,
          silent,
          skipConfirmation,
          local,
          reporter,
          ipfsBinPath,
          _ref4,
          confirmation

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                ;(debug = _ref2.debug),
                  (silent = _ref2.silent),
                  (skipConfirmation = _ref2.skipConfirmation),
                  (local = _ref2.local),
                  (reporter = _ref2.reporter)

                /**
                 * Check if it's installed
                 */
                ipfsBinPath = local
                  ? (0, _util.getLocalBinary)('ipfs', process.cwd())
                  : (0, _util.getGlobalBinary)('ipfs')

                if (ipfsBinPath) {
                  _context2.next = 5
                  break
                }

                reporter.error('IPFS is not installed')
                return _context2.abrupt('return', process.exit(1))

              case 5:
                /**
                 * Print confirmation details
                 */
                reporter.info(
                  'Location: '.concat(_chalk['default'].blue(ipfsBinPath))
                )
                /**
                 * Confirm & uninstall
                 */

                reporter.newLine()

                if (skipConfirmation) {
                  _context2.next = 14
                  break
                }

                _context2.next = 10
                return _inquirer['default'].prompt([
                  {
                    type: 'confirm',
                    name: 'confirmation',
                    default: false,
                    message: 'Are you sure you want to '.concat(
                      _chalk['default'].red('uninstall IPFS'),
                      '?'
                    ),
                  },
                ])

              case 10:
                _ref4 = _context2.sent
                confirmation = _ref4.confirmation

                if (confirmation) {
                  _context2.next = 14
                  break
                }

                return _context2.abrupt('return')

              case 14:
                _context2.next = 16
                return runUninstallTask({
                  silent: silent,
                  debug: debug,
                  local: local,
                })

              case 16:
                reporter.newLine()
                reporter.success('Success!')

              case 18:
              case 'end':
                return _context2.stop()
            }
          }
        }, _callee2)
      })
    )

    return function(_x2) {
      return _ref3.apply(this, arguments)
    }
  })()
// # sourceMappingURL=uninstall.js.map
