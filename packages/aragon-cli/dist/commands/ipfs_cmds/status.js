'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.symbol.iterator')

require('core-js/modules/es.array.is-array')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.date.to-string')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.iterator')

require('core-js/modules/web.dom-collections.iterator')

require('regenerator-runtime/runtime')

var _listr = _interopRequireDefault(require('listr'))

var _chalk = _interopRequireDefault(require('chalk'))

var _publicIp = _interopRequireDefault(require('public-ip'))

var _internalIp = _interopRequireDefault(require('internal-ip'))

var _fs = require('fs')

var _listrOptions = _interopRequireDefault(
  require('@aragon/cli-utils/src/helpers/listr-options')
)

var _util = require('../../util')

var _ipfs = require('../../lib/ipfs')

var _ipfsDaemon = require('../../helpers/ipfs-daemon')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  )
}

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance')
}

function _iterableToArrayLimit(arr, i) {
  if (
    !(
      Symbol.iterator in Object(arr) ||
      Object.prototype.toString.call(arr) === '[object Arguments]'
    )
  ) {
    return
  }
  var _arr = []
  var _n = true
  var _d = false
  var _e = undefined
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value)
      if (i && _arr.length === i) break
    }
  } catch (err) {
    _d = true
    _e = err
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']()
    } finally {
      if (_d) throw _e
    }
  }
  return _arr
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr
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

exports.command = 'status'
exports.describe = 'Status of the IPFS installation & daemon.'

exports.builder = function(yargs) {
  return yargs.option('repo-path', {
    description: 'The location of the IPFS repository',
    default: (0, _ipfs.getDefaultRepoPath)(),
  })
}

var runCheckTask = function runCheckTask(_ref) {
  var silent = _ref.silent
  var debug = _ref.debug
  var repoPath = _ref.repoPath
  return new _listr['default'](
    [
      {
        title: 'Check installations',
        task: function task(ctx) {
          ctx.localBinPath = (0, _util.getLocalBinary)('ipfs', process.cwd())
          ctx.globalBinPath = (0, _util.getGlobalBinary)('ipfs')
        },
      },
      {
        title: 'Check repository',
        task: (function() {
          var _task = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee(ctx) {
              var _ref2, _ref3, version, size, config

              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      ctx.repoExists = (0, _fs.existsSync)(repoPath)

                      if (ctx.repoExists) {
                        _context.next = 3
                        break
                      }

                      return _context.abrupt('return')

                    case 3:
                      _context.next = 5
                      return Promise.all([
                        (0, _ipfs.getRepoVersion)(repoPath),
                        (0, _ipfs.getRepoSize)(repoPath),
                        (0, _ipfs.getRepoConfig)(repoPath),
                      ])

                    case 5:
                      _ref2 = _context.sent
                      _ref3 = _slicedToArray(_ref2, 3)
                      version = _ref3[0]
                      size = _ref3[1]
                      config = _ref3[2]
                      ctx.repoVersion = version
                      ctx.repoSize = size
                      ctx.peerID = (0, _ipfs.getPeerIDConfig)(config)
                      ctx.daemonPorts = (0, _ipfs.getPortsConfig)(config)

                    case 14:
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
      {
        title: 'Check the daemon',
        skip: function skip(ctx) {
          return !ctx.repoExists
        },
        task: (function() {
          var _task2 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee2(ctx) {
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      _context2.next = 2
                      return (0, _ipfs.isDaemonRunning)({
                        protocol: 'http',
                        host: '127.0.0.1',
                        port: ctx.daemonPorts.api,
                      })

                    case 2:
                      ctx.daemonRunning = _context2.sent

                    case 3:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2)
            })
          )

          function task(_x2) {
            return _task2.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Check CORS',
        skip: function skip(ctx) {
          return !ctx.daemonRunning
        },
        task: (function() {
          var _task3 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee3(ctx) {
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch ((_context3.prev = _context3.next)) {
                    case 0:
                      _context3.next = 2
                      return (0, _ipfsDaemon.isIPFSCORS)({
                        protocol: 'http',
                        host: '127.0.0.1',
                        port: ctx.daemonPorts.api,
                      })

                    case 2:
                      ctx.corsEnabled = _context3.sent

                    case 3:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3)
            })
          )

          function task(_x3) {
            return _task3.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Check MultiAddresses',
        skip: function skip(ctx) {
          return !ctx.daemonRunning
        },
        task: (function() {
          var _task4 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee4(ctx) {
              var _ref4, _ref5, publicIP, internalIP

              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch ((_context4.prev = _context4.next)) {
                    case 0:
                      _context4.next = 2
                      return Promise.all([
                        _publicIp['default'].v4(),
                        _internalIp['default'].v4(),
                      ])

                    case 2:
                      _ref4 = _context4.sent
                      _ref5 = _slicedToArray(_ref4, 2)
                      publicIP = _ref5[0]
                      internalIP = _ref5[1]
                      ctx.publicSwarmMultiAddr =
                        '/ip4/' + publicIP + '/tcp/4001/ipfs' + ctx.peerID
                      ctx.internalSwarmMultiAddr =
                        '/ip4/' + internalIP + '/tcp/4001/ipfs' + ctx.peerID
                      ctx.localSwarmMultiAddr =
                        '/ip4/' + '127.0.0.1' + '/tcp/4001/ipfs' + ctx.peerID

                    case 9:
                    case 'end':
                      return _context4.stop()
                  }
                }
              }, _callee4)
            })
          )

          function task(_x4) {
            return _task4.apply(this, arguments)
          }

          return task
        })(),
      }, // Other possible checks:
      // Whether the gateway is open to the public ??
      // Whether the API is open to the public??
      // StorageMax
    ],
    (0, _listrOptions['default'])(silent, debug)
  ).run()
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref7 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee5(_ref6) {
        var reporter,
          debug,
          silent,
          repoPath,
          _ref8,
          localBinPath,
          globalBinPath,
          repoVersion,
          repoSize,
          peerID,
          daemonPorts,
          daemonRunning,
          corsEnabled,
          publicSwarmMultiAddr,
          internalSwarmMultiAddr,
          localSwarmMultiAddr,
          repoExists

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch ((_context5.prev = _context5.next)) {
              case 0:
                ;(reporter = _ref6.reporter),
                  (debug = _ref6.debug),
                  (silent = _ref6.silent),
                  (repoPath = _ref6.repoPath)
                _context5.next = 3
                return runCheckTask({
                  silent: silent,
                  debug: debug,
                  repoPath: repoPath,
                })

              case 3:
                _ref8 = _context5.sent
                localBinPath = _ref8.localBinPath
                globalBinPath = _ref8.globalBinPath
                repoVersion = _ref8.repoVersion
                repoSize = _ref8.repoSize
                peerID = _ref8.peerID
                daemonPorts = _ref8.daemonPorts
                daemonRunning = _ref8.daemonRunning
                corsEnabled = _ref8.corsEnabled
                publicSwarmMultiAddr = _ref8.publicSwarmMultiAddr
                internalSwarmMultiAddr = _ref8.internalSwarmMultiAddr
                localSwarmMultiAddr = _ref8.localSwarmMultiAddr
                repoExists = _ref8.repoExists
                reporter.info(
                  'Local installation: '.concat(
                    _chalk['default'].blue(localBinPath || 'not installed')
                  )
                )
                reporter.info(
                  'Global installation: '.concat(
                    _chalk['default'].blue(globalBinPath || 'not installed')
                  )
                )
                reporter.newLine()

                if (repoExists) {
                  reporter.info(
                    'Repository location: '.concat(
                      _chalk['default'].blue(repoPath)
                    )
                  )
                  reporter.info(
                    'Repository version: '.concat(
                      _chalk['default'].blue(repoVersion)
                    )
                  )
                  reporter.info(
                    'Repository size: '.concat(_chalk['default'].blue(repoSize))
                  )
                  reporter.newLine()
                  reporter.info(
                    'PeerID: '.concat(
                      _chalk['default'].bgWhite(_chalk['default'].black(peerID))
                    )
                  )
                  reporter.info(
                    'Daemon: '.concat(
                      daemonRunning
                        ? _chalk['default'].green('running')
                        : _chalk['default'].red('stopped')
                    )
                  )
                } else {
                  reporter.info(
                    'Repository: '.concat(
                      _chalk['default'].red('uninitialized')
                    )
                  )
                }

                if (daemonRunning) {
                  reporter.info(
                    'CORS: '.concat(
                      corsEnabled
                        ? _chalk['default'].green('enabled')
                        : _chalk['default'].red('disabled')
                    )
                  )
                  reporter.newLine()
                  reporter.info(
                    'API port: '.concat(_chalk['default'].blue(daemonPorts.api))
                  )
                  reporter.info(
                    'Gateway port: '.concat(
                      _chalk['default'].blue(daemonPorts.gateway)
                    )
                  )
                  reporter.info(
                    'Swarm port: '.concat(
                      _chalk['default'].blue(daemonPorts.swarm)
                    )
                  )
                  reporter.newLine()
                  reporter.info(
                    'Public Swarm MultiAddress: '.concat(
                      _chalk['default'].blue(publicSwarmMultiAddr)
                    )
                  )
                  reporter.info(
                    'Internal Swarm MultiAddress: '.concat(
                      _chalk['default'].blue(internalSwarmMultiAddr)
                    )
                  )
                  reporter.info(
                    'Local Swarm MultiAddress: '.concat(
                      _chalk['default'].blue(localSwarmMultiAddr)
                    )
                  )
                }

              case 21:
              case 'end':
                return _context5.stop()
            }
          }
        }, _callee5)
      })
    )

    return function(_x5) {
      return _ref7.apply(this, arguments)
    }
  })()
// # sourceMappingURL=status.js.map
