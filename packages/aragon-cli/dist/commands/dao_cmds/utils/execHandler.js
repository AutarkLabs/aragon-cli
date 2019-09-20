'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.array.filter')

require('core-js/modules/es.array.for-each')

require('core-js/modules/es.object.define-properties')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.get-own-property-descriptor')

require('core-js/modules/es.object.get-own-property-descriptors')

require('core-js/modules/es.object.keys')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/web.dom-collections.for-each')

require('regenerator-runtime/runtime')

var _aragonjsWrapper = _interopRequireDefault(require('./aragonjs-wrapper'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object)
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object)
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable
      })
    keys.push.apply(keys, symbols)
  }
  return keys
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {}
    if (i % 2) {
      ownKeys(source, true).forEach(function(key) {
        _defineProperty(target, key, source[key])
      })
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
    } else {
      ownKeys(source).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        )
      })
    }
  }
  return target
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }
  return obj
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

var chalk = require('chalk')

var startIPFS = require('../../ipfs_cmds/start')

var TaskList = require('listr')

var _require = require('../../../helpers/web3-fallback')
var ensureWeb3 = _require.ensureWeb3

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

exports.task =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee6(dao, getTransactionPath, _ref) {
        var ipfsCheck,
          reporter,
          apm,
          web3,
          wsProvider,
          gasPrice,
          silent,
          debug,
          accounts
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch ((_context6.prev = _context6.next)) {
              case 0:
                ;(ipfsCheck = _ref.ipfsCheck),
                  (reporter = _ref.reporter),
                  (apm = _ref.apm),
                  (web3 = _ref.web3),
                  (wsProvider = _ref.wsProvider),
                  (gasPrice = _ref.gasPrice),
                  (silent = _ref.silent),
                  (debug = _ref.debug)
                _context6.next = 3
                return web3.eth.getAccounts()

              case 3:
                accounts = _context6.sent
                return _context6.abrupt(
                  'return',
                  new TaskList(
                    [
                      {
                        // IPFS is a dependency of getRepoTask which uses IPFS to fetch the contract ABI
                        title: 'Check IPFS',
                        task: function task() {
                          return startIPFS.task({
                            apmOptions: apm,
                          })
                        },
                        enabled: function enabled() {
                          return ipfsCheck
                        },
                      },
                      {
                        title: 'Generating transaction',
                        task: (function() {
                          var _task2 = _asyncToGenerator(
                            /* #__PURE__ */
                            regeneratorRuntime.mark(function _callee4(
                              ctx,
                              _task
                            ) {
                              return regeneratorRuntime.wrap(function _callee4$(
                                _context4
                              ) {
                                while (1) {
                                  switch ((_context4.prev = _context4.next)) {
                                    case 0:
                                      _task.output = 'Fetching DAO at '.concat(
                                        dao,
                                        '...'
                                      )
                                      return _context4.abrupt(
                                        'return',
                                        new Promise(function(resolve, reject) {
                                          var wrapper, appsLoaded

                                          var tryFindTransactionPath =
                                            /* #__PURE__ */
                                            (function() {
                                              var _ref3 = _asyncToGenerator(
                                                /* #__PURE__ */
                                                regeneratorRuntime.mark(
                                                  function _callee() {
                                                    return regeneratorRuntime.wrap(
                                                      function _callee$(
                                                        _context
                                                      ) {
                                                        while (1) {
                                                          switch (
                                                            (_context.prev =
                                                              _context.next)
                                                          ) {
                                                            case 0:
                                                              if (
                                                                !(
                                                                  appsLoaded &&
                                                                  wrapper &&
                                                                  !ctx.transactionPath
                                                                )
                                                              ) {
                                                                _context.next = 11
                                                                break
                                                              }

                                                              _context.prev = 1
                                                              _context.next = 4
                                                              return getTransactionPath(
                                                                wrapper
                                                              )

                                                            case 4:
                                                              ctx.transactionPath =
                                                                _context.sent
                                                              resolve()
                                                              _context.next = 11
                                                              break

                                                            case 8:
                                                              _context.prev = 8
                                                              _context.t0 = _context[
                                                                'catch'
                                                              ](1)
                                                              reject(
                                                                _context.t0
                                                              )

                                                            case 11:
                                                            case 'end':
                                                              return _context.stop()
                                                          }
                                                        }
                                                      },
                                                      _callee,
                                                      null,
                                                      [[1, 8]]
                                                    )
                                                  }
                                                )
                                              )

                                              return function tryFindTransactionPath() {
                                                return _ref3.apply(
                                                  this,
                                                  arguments
                                                )
                                              }
                                            })()

                                          ;(0, _aragonjsWrapper['default'])(
                                            dao,
                                            apm['ens-registry'],
                                            {
                                              ipfsConf: apm.ipfs,
                                              gasPrice: gasPrice,
                                              provider:
                                                wsProvider ||
                                                web3.currentProvider,
                                              accounts: accounts,
                                              onApps: (function() {
                                                var _onApps = _asyncToGenerator(
                                                  /* #__PURE__ */
                                                  regeneratorRuntime.mark(
                                                    function _callee2(apps) {
                                                      return regeneratorRuntime.wrap(
                                                        function _callee2$(
                                                          _context2
                                                        ) {
                                                          while (1) {
                                                            switch (
                                                              (_context2.prev =
                                                                _context2.next)
                                                            ) {
                                                              case 0:
                                                                appsLoaded = true
                                                                _context2.next = 3
                                                                return tryFindTransactionPath()

                                                              case 3:
                                                              case 'end':
                                                                return _context2.stop()
                                                            }
                                                          }
                                                        },
                                                        _callee2
                                                      )
                                                    }
                                                  )
                                                )

                                                function onApps(_x6) {
                                                  return _onApps.apply(
                                                    this,
                                                    arguments
                                                  )
                                                }

                                                return onApps
                                              })(),
                                              onError: function onError(err) {
                                                return reject(err)
                                              },
                                            }
                                          )
                                            .then(
                                              /* #__PURE__ */
                                              (function() {
                                                var _ref4 = _asyncToGenerator(
                                                  /* #__PURE__ */
                                                  regeneratorRuntime.mark(
                                                    function _callee3(
                                                      initializedWrapper
                                                    ) {
                                                      return regeneratorRuntime.wrap(
                                                        function _callee3$(
                                                          _context3
                                                        ) {
                                                          while (1) {
                                                            switch (
                                                              (_context3.prev =
                                                                _context3.next)
                                                            ) {
                                                              case 0:
                                                                wrapper = initializedWrapper
                                                                _context3.next = 3
                                                                return tryFindTransactionPath()

                                                              case 3:
                                                              case 'end':
                                                                return _context3.stop()
                                                            }
                                                          }
                                                        },
                                                        _callee3
                                                      )
                                                    }
                                                  )
                                                )

                                                return function(_x7) {
                                                  return _ref4.apply(
                                                    this,
                                                    arguments
                                                  )
                                                }
                                              })()
                                            )
                                            ['catch'](function(err) {
                                              reporter.error(
                                                'Error inspecting DAO'
                                              )
                                              reporter.debug(err)
                                              process.exit(1)
                                            })
                                        })
                                      )

                                    case 2:
                                    case 'end':
                                      return _context4.stop()
                                  }
                                }
                              },
                              _callee4)
                            })
                          )

                          function task(_x4, _x5) {
                            return _task2.apply(this, arguments)
                          }

                          return task
                        })(),
                      },
                      {
                        title: 'Sending transaction',
                        task: (function() {
                          var _task4 = _asyncToGenerator(
                            /* #__PURE__ */
                            regeneratorRuntime.mark(function _callee5(
                              ctx,
                              _task3
                            ) {
                              var tx
                              return regeneratorRuntime.wrap(function _callee5$(
                                _context5
                              ) {
                                while (1) {
                                  switch ((_context5.prev = _context5.next)) {
                                    case 0:
                                      // aragon.js already calculates the recommended gas
                                      tx = ctx.transactionPath[0] // TODO: Support choosing between possible transaction paths

                                      if (tx) {
                                        _context5.next = 3
                                        break
                                      }

                                      throw new Error(
                                        'Cannot find transaction path for executing action'
                                      )

                                    case 3:
                                      _task3.output =
                                        'Waiting for transaction to be mined...'
                                      _context5.next = 6
                                      return web3.eth.sendTransaction(
                                        ctx.transactionPath[0]
                                      )

                                    case 6:
                                      ctx.receipt = _context5.sent

                                    case 7:
                                    case 'end':
                                      return _context5.stop()
                                  }
                                }
                              },
                              _callee5)
                            })
                          )

                          function task(_x8, _x9) {
                            return _task4.apply(this, arguments)
                          }

                          return task
                        })(),
                      },
                    ],
                    listrOpts(silent, debug)
                  )
                )

              case 5:
              case 'end':
                return _context6.stop()
            }
          }
        }, _callee6)
      })
    )

    return function(_x, _x2, _x3) {
      return _ref2.apply(this, arguments)
    }
  })()

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref5 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee7(dao, getTransactionPath, args) {
        var tasks
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch ((_context7.prev = _context7.next)) {
              case 0:
                _context7.t0 = _objectSpread
                _context7.t1 = {}
                _context7.t2 = args
                _context7.next = 5
                return ensureWeb3(args.network)

              case 5:
                _context7.t3 = _context7.sent
                _context7.t4 = {
                  web3: _context7.t3,
                }
                args = (0, _context7.t0)(
                  _context7.t1,
                  _context7.t2,
                  _context7.t4
                )
                _context7.next = 10
                return exports.task(dao, getTransactionPath, args)

              case 10:
                tasks = _context7.sent
                return _context7.abrupt(
                  'return',
                  tasks.run().then(function(ctx) {
                    args.reporter.success(
                      'Successfully executed: "'.concat(
                        chalk.blue(ctx.transactionPath[0].description),
                        '"'
                      )
                    )
                    process.exit()
                  })
                )

              case 12:
              case 'end':
                return _context7.stop()
            }
          }
        }, _callee7)
      })
    )

    return function(_x10, _x11, _x12) {
      return _ref5.apply(this, arguments)
    }
  })()
// # sourceMappingURL=execHandler.js.map
