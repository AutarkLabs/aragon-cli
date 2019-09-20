'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.includes')

require('core-js/modules/es.array.join')

require('core-js/modules/es.object.assign')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.string.includes')

require('core-js/modules/es.string.replace')

require('regenerator-runtime/runtime')

var _listr = _interopRequireDefault(require('listr'))

var _execa = _interopRequireDefault(require('execa'))

var _goPlatform = _interopRequireDefault(require('go-platform'))

var _inquirer = _interopRequireDefault(require('inquirer'))

var _fs = require('fs')

var _chalk = _interopRequireDefault(require('chalk'))

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

exports.command = 'install'
exports.describe = 'Download and install the go-ipfs binaries.'

exports.builder = function(yargs) {
  return yargs
    .option('dist-version', {
      description: 'The version of IPFS that will be installed',
      default: '0.4.22',
    })
    .option('dist-url', {
      description: 'The url from which to download IPFS',
      default: 'https://dist.ipfs.io',
    })
    .option('local', {
      description: 'Whether to install IPFS as a project dependency',
      boolean: true,
      default: false,
    })
    .option('skip-confirmation', {
      description: 'Whether to skip the confirmation step',
      boolean: true,
      default: false,
    })
}

var runPrepareTask = function runPrepareTask(_ref) {
  var silent = _ref.silent
  var debug = _ref.debug
  var local = _ref.local
  return new _listr['default'](
    [
      {
        title: 'Determine platform and architecture',
        task: function task(ctx) {
          ctx.NODE_OS = process.platform
          ctx.NODE_ARCH = process.arch
        },
      },
      {
        title: 'Determine golang distribution',
        task: function task(ctx) {
          ctx.GO_OS = _goPlatform['default'].GOOS
          ctx.GO_ARCH = _goPlatform['default'].GOARCH
        },
      },
      {
        title: 'Determine location',
        task: (function() {
          var _task = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee(ctx) {
              var packageFile, currentLocation
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      if (!local) {
                        _context.next = 8
                        break
                      }

                      ctx.location = process.cwd()

                      if ((0, _fs.existsSync)('./package.json')) {
                        _context.next = 6
                        break
                      }

                      packageFile = _chalk['default'].red('package.json')
                      currentLocation = _chalk['default'].red(ctx.location)
                      throw new Error(
                        ''
                          .concat(currentLocation, ' does not have a ')
                          .concat(
                            packageFile,
                            '. Did you wish to install IPFS globally?'
                          )
                      )

                    case 6:
                      _context.next = 11
                      break

                    case 8:
                      _context.next = 10
                      return (0, _execa['default'])('npm', [
                        'prefix',
                        '--global',
                      ])

                    case 10:
                      ctx.location = _context.sent.stdout

                    case 11:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee)
            })
          )

          function task(_x) {
            return _task.apply(this, arguments)
          }

          return task
        })(),
      },
    ],
    Object.assign(
      {
        concurrent: true,
      },
      (0, _listrOptions['default'])(silent, debug)
    )
  ).run()
}

var runInstallTask = function runInstallTask(_ref2) {
  var silent = _ref2.silent
  var debug = _ref2.debug
  var local = _ref2.local
  var distUrl = _ref2.distUrl
  var distVersion = _ref2.distVersion
  return new _listr['default'](
    [
      {
        title: 'Install IPFS',
        task: (function() {
          var _task3 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee2(_task2) {
              var npmBinary, exacaOptions, npmArgs, logPrefix, installProcess
              return regeneratorRuntime.wrap(
                function _callee2$(_context2) {
                  while (1) {
                    switch ((_context2.prev = _context2.next)) {
                      case 0:
                        npmBinary = (0, _util.getNodePackageManager)()
                        exacaOptions = {
                          env: {
                            /*
                             *  https://github.com/ipfs/npm-go-ipfs-dep/blob/v0.4.21/src/index.js#L71
                             */
                            GO_IPFS_DIST_URL: distUrl,
                            /*
                             *  specifying `TARGET_VERSION` here, will throw an error, because:
                             *  https://github.com/ipfs/npm-go-ipfs/blob/master/link-ipfs.js#L49
                             */
                            // TARGET_VERSION: distVersion
                          },
                        }
                        npmArgs = ['install', 'go-ipfs@'.concat(distVersion)]

                        if (local) {
                          npmArgs.push('--save')
                        } else {
                          npmArgs.push('--global')
                        }

                        logPrefix = 'npm '.concat(npmArgs.join(' '), ':')
                        installProcess = (0, _execa['default'])(
                          npmBinary,
                          npmArgs,
                          exacaOptions
                        )
                        installProcess.stdout.on('data', function(data) {
                          if (data)
                            _task2.output = ''
                              .concat(logPrefix, ' ')
                              .concat(data)
                        })
                        _context2.prev = 7
                        _context2.next = 10
                        return installProcess

                      case 10:
                        _context2.next = 19
                        break

                      case 12:
                        _context2.prev = 12
                        _context2.t0 = _context2['catch'](7)

                        if (
                          !_context2.t0.stderr.includes(
                            'No matching version found'
                          )
                        ) {
                          _context2.next = 18
                          break
                        }

                        throw new Error(
                          'NPM cannot find version '.concat(
                            distVersion,
                            '. For more versions see: http://npmjs.com/package/go-ipfs?activeTab=versions'
                          )
                        )

                      case 18:
                        throw new Error(_context2.t0.stderr)

                      case 19:
                      case 'end':
                        return _context2.stop()
                    }
                  }
                },
                _callee2,
                null,
                [[7, 12]]
              )
            })
          )

          function task(_x2) {
            return _task3.apply(this, arguments)
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
    var _ref4 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee3(_ref3) {
        var debug,
          silent,
          distVersion,
          distUrl,
          local,
          reporter,
          skipConfirmation,
          existingBinaryLocation,
          uninstallCommand,
          _ref5,
          NODE_OS,
          NODE_ARCH,
          GO_OS,
          GO_ARCH,
          location,
          actualVersion,
          distName,
          _ref6,
          confirmation

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                ;(debug = _ref3.debug),
                  (silent = _ref3.silent),
                  (distVersion = _ref3.distVersion),
                  (distUrl = _ref3.distUrl),
                  (local = _ref3.local),
                  (reporter = _ref3.reporter),
                  (skipConfirmation = _ref3.skipConfirmation)

                /**
                 * Check if it's already installed
                 */
                existingBinaryLocation = local
                  ? (0, _util.getLocalBinary)('ipfs', process.cwd())
                  : (0, _util.getGlobalBinary)('ipfs')

                if (!existingBinaryLocation) {
                  _context3.next = 9
                  break
                }

                reporter.error(
                  'IPFS is already installed:',
                  _chalk['default'].red(existingBinaryLocation)
                )
                reporter.newLine()
                uninstallCommand = local
                  ? 'aragon ipfs uninstall --local'
                  : 'aragon ipfs uninstall'
                reporter.warning(
                  'To install a different version, you must first run:',
                  _chalk['default'].yellow(uninstallCommand)
                )

                if (!local) {
                  reporter.warning(
                    'To install IPFS in a project, use the --local flag:',
                    _chalk['default'].yellow('aragon ipfs install --local')
                  )
                }

                return _context3.abrupt('return', process.exit(1))

              case 9:
                /**
                 * Prepare confirmation details
                 */
                reporter.info('Preparing:')
                _context3.next = 12
                return runPrepareTask({
                  debug: debug,
                  silent: silent,
                  local: local,
                })

              case 12:
                _ref5 = _context3.sent
                NODE_OS = _ref5.NODE_OS
                NODE_ARCH = _ref5.NODE_ARCH
                GO_OS = _ref5.GO_OS
                GO_ARCH = _ref5.GO_ARCH
                location = _ref5.location
                actualVersion = distVersion.replace(/-hacky[0-9]+/, '')
                distName = 'go-ipfs_v'
                  .concat(actualVersion, '_')
                  .concat(GO_OS, '-')
                  .concat(GO_ARCH, '.tar.gz')
                reporter.newLine()
                reporter.info(
                  'Platform & architecture: '
                    .concat(_chalk['default'].blue(NODE_OS), ', ')
                    .concat(_chalk['default'].blue(NODE_ARCH))
                )
                reporter.info(
                  'IPFS tarball: '.concat(_chalk['default'].blue(distName))
                )
                reporter.info(
                  'IPFS distributions url: '.concat(
                    _chalk['default'].blue(distUrl)
                  )
                )
                reporter.info(
                  'NPM version: '.concat(_chalk['default'].blue(distVersion))
                )
                reporter.info(
                  'Location: '.concat(_chalk['default'].blue(location))
                )
                /**
                 * Confirm & install
                 */

                reporter.newLine()

                if (skipConfirmation) {
                  _context3.next = 34
                  break
                }

                _context3.next = 30
                return _inquirer['default'].prompt([
                  {
                    type: 'confirm',
                    name: 'confirmation',
                    message: 'Are you sure you want to '.concat(
                      _chalk['default'].green('install IPFS'),
                      '?'
                    ),
                  },
                ])

              case 30:
                _ref6 = _context3.sent
                confirmation = _ref6.confirmation

                if (confirmation) {
                  _context3.next = 34
                  break
                }

                return _context3.abrupt('return')

              case 34:
                _context3.next = 36
                return runInstallTask({
                  debug: debug,
                  silent: silent,
                  distUrl: distUrl,
                  distVersion: distVersion,
                  local: local,
                })

              case 36:
                reporter.newLine()
                reporter.success('Success!')
                reporter.info(
                  'Try it out with: '.concat(
                    _chalk['default'].blue(
                      local ? 'npx ipfs version' : 'ipfs version'
                    )
                  )
                )

              case 39:
              case 'end':
                return _context3.stop()
            }
          }
        }, _callee3)
      })
    )

    return function(_x3) {
      return _ref4.apply(this, arguments)
    }
  })()
// # sourceMappingURL=install.js.map
