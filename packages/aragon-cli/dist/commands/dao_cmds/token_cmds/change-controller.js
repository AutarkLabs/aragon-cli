'use strict'

require('core-js/modules/es.array.concat')

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

var TaskList = require('listr')

var _require = require('../../../helpers/web3-fallback')
var ensureWeb3 = _require.ensureWeb3

var _require2 = require('../../../util')
var getContract = _require2.getContract

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

var chalk = require('chalk')

var _require3 = require('../../../util')
var getRecommendedGasLimit = _require3.getRecommendedGasLimit

exports.command = 'change-controller <token-address> <new-controller>'
exports.describe = 'Change the controller of a MiniMe token'

exports.builder = function(yargs) {
  return yargs
    .positional('token-address', {
      description: 'Address of the MiniMe token',
    })
    .positional('new-controller', {
      description: 'Address of the new controller',
    })
}

exports.task =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee2(_ref) {
        var web3,
          gasPrice,
          tokenAddress,
          newController,
          silent,
          debug,
          accounts,
          from
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                ;(web3 = _ref.web3),
                  (gasPrice = _ref.gasPrice),
                  (tokenAddress = _ref.tokenAddress),
                  (newController = _ref.newController),
                  (silent = _ref.silent),
                  (debug = _ref.debug)
                _context2.next = 3
                return web3.eth.getAccounts()

              case 3:
                accounts = _context2.sent
                from = accounts[0]
                return _context2.abrupt(
                  'return',
                  new TaskList(
                    [
                      {
                        title: 'Changing the MiniMe token controller',
                        task: (function() {
                          var _task2 = _asyncToGenerator(
                            /* #__PURE__ */
                            regeneratorRuntime.mark(function _callee(
                              ctx,
                              _task
                            ) {
                              var artifact, contract, tx, gas, sendPromise
                              return regeneratorRuntime.wrap(function _callee$(
                                _context
                              ) {
                                while (1) {
                                  switch ((_context.prev = _context.next)) {
                                    case 0:
                                      artifact = getContract(
                                        '@aragon/apps-shared-minime',
                                        'MiniMeToken'
                                      )
                                      contract = new web3.eth.Contract(
                                        artifact.abi,
                                        tokenAddress
                                      )
                                      tx = contract.methods.changeController(
                                        newController
                                      ) // this fails if from is not passed

                                      _context.t0 = getRecommendedGasLimit
                                      _context.t1 = web3
                                      _context.next = 7
                                      return tx.estimateGas({
                                        from: from,
                                      })

                                    case 7:
                                      _context.t2 = _context.sent
                                      _context.next = 10
                                      return (0, _context.t0)(
                                        _context.t1,
                                        _context.t2
                                      )

                                    case 10:
                                      gas = _context.sent
                                      sendPromise = tx.send({
                                        from: from,
                                        gas: gas,
                                        gasPrice: gasPrice,
                                      })
                                      sendPromise
                                        .on('transactionHash', function(
                                          transactionHash
                                        ) {
                                          ctx.txHash = transactionHash
                                        })
                                        .on('error', function(error) {
                                          throw error
                                        })
                                      _task.output =
                                        'Waiting for the transaction to be mined...'
                                      return _context.abrupt(
                                        'return',
                                        sendPromise
                                      )

                                    case 15:
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
                      },
                    ],
                    listrOpts(silent, debug)
                  )
                )

              case 6:
              case 'end':
                return _context2.stop()
            }
          }
        }, _callee2)
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
      regeneratorRuntime.mark(function _callee3(_ref3) {
        var reporter,
          gasPrice,
          network,
          tokenAddress,
          newController,
          silent,
          debug,
          web3,
          task
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                ;(reporter = _ref3.reporter),
                  (gasPrice = _ref3.gasPrice),
                  (network = _ref3.network),
                  (tokenAddress = _ref3.tokenAddress),
                  (newController = _ref3.newController),
                  (silent = _ref3.silent),
                  (debug = _ref3.debug)
                _context3.next = 3
                return ensureWeb3(network)

              case 3:
                web3 = _context3.sent
                _context3.next = 6
                return exports.task({
                  web3: web3,
                  gasPrice: gasPrice,
                  reporter: reporter,
                  tokenAddress: tokenAddress,
                  newController: newController,
                  silent: silent,
                  debug: debug,
                })

              case 6:
                task = _context3.sent
                return _context3.abrupt(
                  'return',
                  task.run().then(function(ctx) {
                    reporter.success(
                      'Successfully changed the controller of '
                        .concat(chalk.green(tokenAddress), ' to ')
                        .concat(chalk.green(newController))
                    )
                    reporter.info(
                      'Transaction hash: '.concat(chalk.blue(ctx.txHash))
                    )
                    process.exit()
                  })
                )

              case 8:
              case 'end':
                return _context3.stop()
            }
          }
        }, _callee3)
      })
    )

    return function(_x4) {
      return _ref4.apply(this, arguments)
    }
  })()
// # sourceMappingURL=change-controller.js.map
