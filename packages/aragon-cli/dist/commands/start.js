'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('regenerator-runtime/runtime')

var _start = require('../lib/start')

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

var chalk = require('chalk')

var TaskList = require('listr')

var pkg = require('../../package.json')

var _require = require('../util')
var installDeps = _require.installDeps

var DEFAULT_CLIENT_REPO = pkg.aragon.clientRepo
var DEFAULT_CLIENT_VERSION = pkg.aragon.clientVersion
var DEFAULT_CLIENT_PORT = pkg.aragon.clientPort
exports.command = 'start [client-version]'
exports.describe = 'Start the Aragon GUI (graphical user interface)'

exports.builder = function(yargs) {
  return yargs
    .positional('client-repo', {
      description:
        'Repo of Aragon client used to run your sandboxed app (valid git repository using https or ssh protocol)',
      default: DEFAULT_CLIENT_REPO,
    })
    .positional('client-version', {
      description:
        'Version of Aragon client used to run your sandboxed app (commit hash, branch name or tag name)',
      default: DEFAULT_CLIENT_VERSION,
    })
    .option('client-port', {
      description: 'Port being used by Aragon client',
      default: DEFAULT_CLIENT_PORT,
    })
    .option('client-path', {
      description: 'A path pointing to an existing Aragon client installation',
      default: null,
    })
}

exports.task =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee7(_ref) {
        var clientRepo, clientVersion, clientPort, clientPath, tasks
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch ((_context7.prev = _context7.next)) {
              case 0:
                ;(clientRepo = _ref.clientRepo),
                  (clientVersion = _ref.clientVersion),
                  (clientPort = _ref.clientPort),
                  (clientPath = _ref.clientPath)
                tasks = new TaskList([
                  {
                    title: 'Fetching client from aragen',
                    skip: function skip() {
                      return !!clientPath
                    },
                    task: (function() {
                      var _task2 = _asyncToGenerator(
                        /* #__PURE__ */
                        regeneratorRuntime.mark(function _callee(ctx, _task) {
                          return regeneratorRuntime.wrap(function _callee$(
                            _context
                          ) {
                            while (1) {
                              switch ((_context.prev = _context.next)) {
                                case 0:
                                  _task.output = 'Fetching client...'
                                  _context.next = 3
                                  return (0, _start.fetchClient)(
                                    ctx,
                                    _task,
                                    DEFAULT_CLIENT_VERSION
                                  )

                                case 3:
                                case 'end':
                                  return _context.stop()
                              }
                            }
                          },
                          _callee)
                        })
                      )

                      function task(_x2, _x3) {
                        return _task2.apply(this, arguments)
                      }

                      return task
                    })(),
                    enabled: function enabled() {
                      return clientVersion === DEFAULT_CLIENT_VERSION
                    },
                  },
                  {
                    title: 'Downloading client',
                    skip: function skip(ctx) {
                      return !!clientPath
                    },
                    task: (function() {
                      var _task4 = _asyncToGenerator(
                        /* #__PURE__ */
                        regeneratorRuntime.mark(function _callee2(ctx, _task3) {
                          return regeneratorRuntime.wrap(function _callee2$(
                            _context2
                          ) {
                            while (1) {
                              switch ((_context2.prev = _context2.next)) {
                                case 0:
                                  _task3.output = 'Downloading client...'
                                  _context2.next = 3
                                  return (0, _start.downloadClient)({
                                    ctx: ctx,
                                    task: _task3,
                                    clientRepo: clientRepo,
                                    clientVersion: clientVersion,
                                  })

                                case 3:
                                case 'end':
                                  return _context2.stop()
                              }
                            }
                          },
                          _callee2)
                        })
                      )

                      function task(_x4, _x5) {
                        return _task4.apply(this, arguments)
                      }

                      return task
                    })(),
                    enabled: function enabled(ctx) {
                      return !ctx.clientFetch
                    },
                  },
                  {
                    title: 'Installing client dependencies',
                    task: (function() {
                      var _task6 = _asyncToGenerator(
                        /* #__PURE__ */
                        regeneratorRuntime.mark(function _callee3(ctx, _task5) {
                          return regeneratorRuntime.wrap(function _callee3$(
                            _context3
                          ) {
                            while (1) {
                              switch ((_context3.prev = _context3.next)) {
                                case 0:
                                  return _context3.abrupt(
                                    'return',
                                    installDeps(ctx.clientPath, _task5)
                                  )

                                case 1:
                                case 'end':
                                  return _context3.stop()
                              }
                            }
                          },
                          _callee3)
                        })
                      )

                      function task(_x6, _x7) {
                        return _task6.apply(this, arguments)
                      }

                      return task
                    })(),
                    enabled: function enabled(ctx) {
                      return !ctx.clientAvailable && !clientPath
                    },
                  },
                  {
                    title: 'Building Aragon client',
                    task: (function() {
                      var _task8 = _asyncToGenerator(
                        /* #__PURE__ */
                        regeneratorRuntime.mark(function _callee4(ctx, _task7) {
                          return regeneratorRuntime.wrap(function _callee4$(
                            _context4
                          ) {
                            while (1) {
                              switch ((_context4.prev = _context4.next)) {
                                case 0:
                                  _task7.output = 'Building Aragon client...'
                                  _context4.next = 3
                                  return (0, _start.buildClient)(
                                    ctx,
                                    clientPath
                                  )

                                case 3:
                                case 'end':
                                  return _context4.stop()
                              }
                            }
                          },
                          _callee4)
                        })
                      )

                      function task(_x8, _x9) {
                        return _task8.apply(this, arguments)
                      }

                      return task
                    })(),
                    enabled: function enabled(ctx) {
                      return !ctx.clientAvailable
                    },
                  },
                  {
                    title: 'Starting Aragon client',
                    task: (function() {
                      var _task10 = _asyncToGenerator(
                        /* #__PURE__ */
                        regeneratorRuntime.mark(function _callee5(ctx, _task9) {
                          return regeneratorRuntime.wrap(function _callee5$(
                            _context5
                          ) {
                            while (1) {
                              switch ((_context5.prev = _context5.next)) {
                                case 0:
                                  _task9.output = 'Starting Aragon client...'
                                  _context5.next = 3
                                  return (0, _start.startClient)(
                                    ctx,
                                    clientPort,
                                    clientPath
                                  )

                                case 3:
                                case 'end':
                                  return _context5.stop()
                              }
                            }
                          },
                          _callee5)
                        })
                      )

                      function task(_x10, _x11) {
                        return _task10.apply(this, arguments)
                      }

                      return task
                    })(),
                  },
                  {
                    title: 'Opening client',
                    task: (function() {
                      var _task12 = _asyncToGenerator(
                        /* #__PURE__ */
                        regeneratorRuntime.mark(function _callee6(
                          ctx,
                          _task11
                        ) {
                          return regeneratorRuntime.wrap(function _callee6$(
                            _context6
                          ) {
                            while (1) {
                              switch ((_context6.prev = _context6.next)) {
                                case 0:
                                  _task11.output = 'Opening client'
                                  _context6.next = 3
                                  return (0, _start.openClient)(ctx, clientPort)

                                case 3:
                                case 'end':
                                  return _context6.stop()
                              }
                            }
                          },
                          _callee6)
                        })
                      )

                      function task(_x12, _x13) {
                        return _task12.apply(this, arguments)
                      }

                      return task
                    })(),
                  },
                ])
                return _context7.abrupt('return', tasks)

              case 3:
              case 'end':
                return _context7.stop()
            }
          }
        }, _callee7)
      })
    )

    return function(_x) {
      return _ref2.apply(this, arguments)
    }
  })()

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref4 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee8(_ref3) {
        var reporter, clientRepo, clientVersion, clientPort, clientPath, task
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch ((_context8.prev = _context8.next)) {
              case 0:
                ;(reporter = _ref3.reporter),
                  (clientRepo = _ref3.clientRepo),
                  (clientVersion = _ref3.clientVersion),
                  (clientPort = _ref3.clientPort),
                  (clientPath = _ref3.clientPath)
                _context8.next = 3
                return exports.task({
                  clientRepo: clientRepo,
                  clientVersion: clientVersion,
                  clientPort: clientPort,
                  clientPath: clientPath,
                })

              case 3:
                task = _context8.sent
                return _context8.abrupt(
                  'return',
                  task.run().then(function() {
                    return reporter.info(
                      'Aragon client from '
                        .concat(chalk.blue(clientRepo), ' version ')
                        .concat(chalk.blue(clientVersion), ' started on port ')
                        .concat(chalk.blue(clientPort))
                    )
                  })
                )

              case 5:
              case 'end':
                return _context8.stop()
            }
          }
        }, _callee8)
      })
    )

    return function(_x14) {
      return _ref4.apply(this, arguments)
    }
  })()
// # sourceMappingURL=start.js.map
