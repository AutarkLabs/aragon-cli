'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.includes')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.constructor')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.includes')

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

var TaskList = require('listr')

var ENS = require('ethereum-ens')

var _require = require('../../helpers/web3-fallback')
var ensureWeb3 = _require.ensureWeb3

var _require2 = require('chalk')
var green = _require2.green

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

var _require3 = require('web3-utils')
var isAddress = _require3.isAddress

var registrarAbi = require('@aragon/id/abi/IFIFSResolvingRegistrar').abi

var _require4 = require('web3-utils')
var sha3 = _require4.sha3

var ARAGON_DOMAIN = 'aragonid.eth' // dao id assign command

var idAssignCommand = 'assign <dao> <aragon-id>'
var idAssignDescribe = 'Assign an Aragon Id to a DAO address'

var idAssignBuilder = function idAssignBuilder(yargs) {
  return yargs
    .positional('dao', {
      description: 'DAO address',
      type: 'string',
    })
    .positional('aragon-id', {
      description: 'Aragon Id',
      type: 'string',
    })
} // dao id shortcut

exports.command = 'id <dao> <aragon-id>'
exports.describe = 'Shortcut for `dao id assign`'

exports.builder = function(yargs) {
  return idAssignBuilder(yargs).command(
    idAssignCommand,
    idAssignDescribe,
    idAssignBuilder,
    exports.handler
  )
}

exports.task =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee3(_ref) {
        var dao,
          aragonId,
          web3,
          gasPrice,
          apmOptions,
          silent,
          debug,
          reporter,
          tasks
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                ;(dao = _ref.dao),
                  (aragonId = _ref.aragonId),
                  (web3 = _ref.web3),
                  (gasPrice = _ref.gasPrice),
                  (apmOptions = _ref.apmOptions),
                  (silent = _ref.silent),
                  (debug = _ref.debug),
                  (reporter = _ref.reporter)

                if (!isAddress(dao)) {
                  reporter.error('Invalid DAO address')
                  process.exit(1)
                }

                tasks = new TaskList(
                  [
                    {
                      title: 'Validating Id',
                      task: (function() {
                        var _task = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee(ctx) {
                            var ens, exists
                            return regeneratorRuntime.wrap(
                              function _callee$(_context) {
                                while (1) {
                                  switch ((_context.prev = _context.next)) {
                                    case 0:
                                      if (
                                        !/^([\w-]+)$/.test(aragonId) &&
                                        !new RegExp(
                                          '^([\\w-]+).'.concat(
                                            ARAGON_DOMAIN,
                                            '$'
                                          )
                                        ).test(aragonId)
                                      ) {
                                        reporter.error('Invalid Aragon Id')
                                        process.exit(1)
                                      }

                                      ens = ctx.ens = new ENS(
                                        web3.currentProvider,
                                        apmOptions['ens-registry']
                                      )
                                      ctx.domain = aragonId.includes(
                                        ARAGON_DOMAIN
                                      )
                                        ? aragonId
                                        : ''
                                            .concat(aragonId, '.')
                                            .concat(ARAGON_DOMAIN) // Check name doesn't already exist

                                      _context.prev = 3
                                      _context.next = 6
                                      return ens.resolver(ctx.domain).addr()

                                    case 6:
                                      exists = _context.sent

                                      if (exists) {
                                        reporter.error(
                                          'Cannot assign: '
                                            .concat(
                                              ctx.domain,
                                              ' is already assigned to '
                                            )
                                            .concat(exists, '.')
                                        )
                                        process.exit(1)
                                      }

                                      _context.next = 14
                                      break

                                    case 10:
                                      _context.prev = 10
                                      _context.t0 = _context['catch'](3)

                                      if (!(_context.t0 !== ENS.NameNotFound)) {
                                        _context.next = 14
                                        break
                                      }

                                      throw _context.t0

                                    case 14:
                                    case 'end':
                                      return _context.stop()
                                  }
                                }
                              },
                              _callee,
                              null,
                              [[3, 10]]
                            )
                          })
                        )

                        function task(_x2) {
                          return _task.apply(this, arguments)
                        }

                        return task
                      })(),
                    },
                    {
                      title: 'Assigning Id',
                      task: (function() {
                        var _task2 = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee2(ctx) {
                            var registrar
                            return regeneratorRuntime.wrap(function _callee2$(
                              _context2
                            ) {
                              while (1) {
                                switch ((_context2.prev = _context2.next)) {
                                  case 0:
                                    _context2.t0 = web3.eth.Contract
                                    _context2.t1 = registrarAbi
                                    _context2.next = 4
                                    return ctx.ens.owner(ARAGON_DOMAIN)

                                  case 4:
                                    _context2.t2 = _context2.sent
                                    registrar = new _context2.t0(
                                      _context2.t1,
                                      _context2.t2
                                    )
                                    _context2.t3 = registrar.methods.register(
                                      sha3(aragonId),
                                      dao
                                    )
                                    _context2.next = 9
                                    return web3.eth.getAccounts()

                                  case 9:
                                    _context2.t4 = _context2.sent[0]
                                    _context2.t5 = gasPrice
                                    _context2.t6 = {
                                      from: _context2.t4,
                                      gas: '1000000',
                                      gasPrice: _context2.t5,
                                    }
                                    _context2.next = 14
                                    return _context2.t3.send.call(
                                      _context2.t3,
                                      _context2.t6
                                    )

                                  case 14:
                                    ctx.receipt = _context2.sent

                                  case 15:
                                  case 'end':
                                    return _context2.stop()
                                }
                              }
                            },
                            _callee2)
                          })
                        )

                        function task(_x3) {
                          return _task2.apply(this, arguments)
                        }

                        return task
                      })(),
                    },
                  ],
                  listrOpts(silent, debug)
                )
                return _context3.abrupt('return', tasks)

              case 4:
              case 'end':
                return _context3.stop()
            }
          }
        }, _callee3)
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
      regeneratorRuntime.mark(function _callee4(_ref3) {
        var aragonId, reporter, network, apmOptions, dao, gasPrice, web3, task
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch ((_context4.prev = _context4.next)) {
              case 0:
                ;(aragonId = _ref3.aragonId),
                  (reporter = _ref3.reporter),
                  (network = _ref3.network),
                  (apmOptions = _ref3.apm),
                  (dao = _ref3.dao),
                  (gasPrice = _ref3.gasPrice)
                _context4.next = 3
                return ensureWeb3(network)

              case 3:
                web3 = _context4.sent
                _context4.next = 6
                return exports.task({
                  aragonId: aragonId,
                  dao: dao,
                  web3: web3,
                  reporter: reporter,
                  network: network,
                  apmOptions: apmOptions,
                  gasPrice: gasPrice,
                })

              case 6:
                task = _context4.sent
                return _context4.abrupt(
                  'return',
                  task.run().then(function(ctx) {
                    reporter.success(
                      ''
                        .concat(green(ctx.domain), ' successfully assigned to ')
                        .concat(dao)
                    )
                    process.exit()
                  })
                )

              case 8:
              case 'end':
                return _context4.stop()
            }
          }
        }, _callee4)
      })
    )

    return function(_x4) {
      return _ref4.apply(this, arguments)
    }
  })()
// # sourceMappingURL=id-assign.js.map
