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

var TaskList = require('listr')

var _require = require('../../../helpers/web3-fallback')
var ensureWeb3 = _require.ensureWeb3

var _require2 = require('../../../util')
var getContract = _require2.getContract

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

var chalk = require('chalk')

var web3Utils = require('web3-utils')

var _require3 = require('../../../util')
var getRecommendedGasLimit = _require3.getRecommendedGasLimit
var parseArgumentStringIfPossible = _require3.parseArgumentStringIfPossible
var ZERO_ADDRESS = _require3.ZERO_ADDRESS

var MAINNET_MINIME_TOKEN_FACTORY = '0xA29EF584c389c67178aE9152aC9C543f9156E2B3'
var RINKEBY_MINIME_TOKEN_FACTORY = '0xad991658443c56b3dE2D7d7f5d8C68F339aEef29'
exports.command =
  'new <token-name> <symbol> [decimal-units] [transfer-enabled] [token-factory-address]'
exports.describe = 'Create a new MiniMe token'

exports.builder = function(yargs) {
  return yargs
    .positional('token-name', {
      description: 'Full name of the new Token',
    })
    .positional('symbol', {
      description: 'Symbol of the new Token',
    })
    .option('decimal-units', {
      description: 'Total decimal units the new token will use',
      default: 18,
    })
    .option('transfer-enabled', {
      description: 'Whether the new token will have transfers enabled',
      default: true,
    })
    .option('token-factory-address', {
      description: 'Address of the MiniMeTokenFactory',
      type: 'string',
    })
}

exports.task =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee3(_ref) {
        var web3,
          gasPrice,
          tokenName,
          symbol,
          transferEnabled,
          decimalUnits,
          tokenFactoryAddress,
          silent,
          debug,
          accounts,
          from,
          chainId
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                ;(web3 = _ref.web3),
                  (gasPrice = _ref.gasPrice),
                  (tokenName = _ref.tokenName),
                  (symbol = _ref.symbol),
                  (transferEnabled = _ref.transferEnabled),
                  (decimalUnits = _ref.decimalUnits),
                  (tokenFactoryAddress = _ref.tokenFactoryAddress),
                  (silent = _ref.silent),
                  (debug = _ref.debug)
                _context3.next = 3
                return web3.eth.getAccounts()

              case 3:
                accounts = _context3.sent
                from = accounts[0] // Get chain id

                _context3.next = 7
                return web3.eth.net.getId()

              case 7:
                chainId = _context3.sent
                if (chainId === 1)
                  tokenFactoryAddress =
                    tokenFactoryAddress || MAINNET_MINIME_TOKEN_FACTORY
                if (chainId === 4)
                  tokenFactoryAddress =
                    tokenFactoryAddress || RINKEBY_MINIME_TOKEN_FACTORY
                transferEnabled = parseArgumentStringIfPossible(transferEnabled)
                return _context3.abrupt(
                  'return',
                  new TaskList(
                    [
                      {
                        title: 'Deploy the MiniMeTokenFactory contract',
                        enabled: function enabled() {
                          return !web3Utils.isAddress(tokenFactoryAddress)
                        },
                        task: (function() {
                          var _task2 = _asyncToGenerator(
                            /* #__PURE__ */
                            regeneratorRuntime.mark(function _callee(
                              ctx,
                              _task
                            ) {
                              var artifact,
                                contract,
                                deployTx,
                                estimatedGas,
                                deployPromise
                              return regeneratorRuntime.wrap(function _callee$(
                                _context
                              ) {
                                while (1) {
                                  switch ((_context.prev = _context.next)) {
                                    case 0:
                                      artifact = getContract(
                                        '@aragon/apps-shared-minime',
                                        'MiniMeTokenFactory'
                                      )
                                      contract = new web3.eth.Contract(
                                        artifact.abi
                                      )
                                      deployTx = contract.deploy({
                                        data: artifact.bytecode,
                                      })
                                      _context.next = 5
                                      return deployTx.estimateGas()

                                    case 5:
                                      estimatedGas = _context.sent
                                      _context.t0 = deployTx
                                      _context.t1 = from
                                      _context.next = 10
                                      return getRecommendedGasLimit(
                                        web3,
                                        estimatedGas
                                      )

                                    case 10:
                                      _context.t2 = _context.sent
                                      _context.t3 = gasPrice
                                      _context.t4 = {
                                        from: _context.t1,
                                        gas: _context.t2,
                                        gasPrice: _context.t3,
                                      }
                                      deployPromise = _context.t0.send.call(
                                        _context.t0,
                                        _context.t4
                                      )
                                      deployPromise
                                        .on('receipt', function(receipt) {
                                          ctx.factoryAddress =
                                            receipt.contractAddress
                                        })
                                        .on('transactionHash', function(
                                          transactionHash
                                        ) {
                                          ctx.factoryTxHash = transactionHash
                                        })
                                        .on('error', function(error) {
                                          throw error
                                        })
                                      _task.output =
                                        'Waiting for the transaction to be mined...'
                                      return _context.abrupt(
                                        'return',
                                        deployPromise
                                      )

                                    case 17:
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
                      {
                        title: 'Deploy the MiniMeToken contract',
                        task: (function() {
                          var _task4 = _asyncToGenerator(
                            /* #__PURE__ */
                            regeneratorRuntime.mark(function _callee2(
                              ctx,
                              _task3
                            ) {
                              var artifact,
                                contract,
                                deployTx,
                                estimatedGas,
                                deployPromise
                              return regeneratorRuntime.wrap(function _callee2$(
                                _context2
                              ) {
                                while (1) {
                                  switch ((_context2.prev = _context2.next)) {
                                    case 0:
                                      artifact = getContract(
                                        '@aragon/apps-shared-minime',
                                        'MiniMeToken'
                                      )
                                      contract = new web3.eth.Contract(
                                        artifact.abi
                                      )
                                      deployTx = contract.deploy({
                                        data: artifact.bytecode,
                                        arguments: [
                                          ctx.factoryAddress ||
                                            tokenFactoryAddress,
                                          ZERO_ADDRESS,
                                          0,
                                          tokenName,
                                          decimalUnits,
                                          symbol,
                                          transferEnabled,
                                        ],
                                      })
                                      _context2.next = 5
                                      return deployTx.estimateGas()

                                    case 5:
                                      estimatedGas = _context2.sent
                                      _context2.t0 = deployTx
                                      _context2.t1 = from
                                      _context2.next = 10
                                      return getRecommendedGasLimit(
                                        web3,
                                        estimatedGas
                                      )

                                    case 10:
                                      _context2.t2 = _context2.sent
                                      _context2.t3 = gasPrice
                                      _context2.t4 = {
                                        from: _context2.t1,
                                        gas: _context2.t2,
                                        gasPrice: _context2.t3,
                                      }
                                      deployPromise = _context2.t0.send.call(
                                        _context2.t0,
                                        _context2.t4
                                      )
                                      deployPromise
                                        .on('receipt', function(receipt) {
                                          ctx.tokenAddress =
                                            receipt.contractAddress
                                        })
                                        .on('transactionHash', function(
                                          transactionHash
                                        ) {
                                          ctx.tokenTxHash = transactionHash
                                        })
                                        .on('error', function(error) {
                                          throw error
                                        })
                                      _task3.output =
                                        'Waiting for the transaction to be mined...'
                                      return _context2.abrupt(
                                        'return',
                                        deployPromise
                                      )

                                    case 17:
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
                      },
                    ],
                    listrOpts(silent, debug)
                  )
                )

              case 12:
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
        var reporter,
          network,
          gasPrice,
          tokenName,
          symbol,
          transferEnabled,
          decimalUnits,
          tokenFactoryAddress,
          silent,
          debug,
          web3,
          task
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch ((_context4.prev = _context4.next)) {
              case 0:
                ;(reporter = _ref3.reporter),
                  (network = _ref3.network),
                  (gasPrice = _ref3.gasPrice),
                  (tokenName = _ref3.tokenName),
                  (symbol = _ref3.symbol),
                  (transferEnabled = _ref3.transferEnabled),
                  (decimalUnits = _ref3.decimalUnits),
                  (tokenFactoryAddress = _ref3.tokenFactoryAddress),
                  (silent = _ref3.silent),
                  (debug = _ref3.debug)
                _context4.next = 3
                return ensureWeb3(network)

              case 3:
                web3 = _context4.sent
                _context4.next = 6
                return exports.task({
                  web3: web3,
                  gasPrice: gasPrice,
                  tokenName: tokenName,
                  symbol: symbol,
                  transferEnabled: transferEnabled,
                  decimalUnits: decimalUnits,
                  tokenFactoryAddress: tokenFactoryAddress,
                  silent: silent,
                  debug: debug,
                })

              case 6:
                task = _context4.sent
                return _context4.abrupt(
                  'return',
                  task.run().then(function(ctx) {
                    reporter.success(
                      'Successfully deployed the token at '.concat(
                        chalk.green(ctx.tokenAddress)
                      )
                    )
                    reporter.info(
                      'Token transaction hash: '.concat(
                        chalk.blue(ctx.tokenTxHash)
                      )
                    )

                    if (ctx.factoryAddress) {
                      reporter.success(
                        'Successfully deployed the token factory at '.concat(
                          chalk.green(ctx.factoryAddress)
                        )
                      )
                      reporter.info(
                        'Token factory transaction hash: '.concat(
                          chalk.blue(ctx.factoryTxHash)
                        )
                      )
                    }

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

    return function(_x6) {
      return _ref4.apply(this, arguments)
    }
  })()
// # sourceMappingURL=new.js.map
