'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.join')

require('core-js/modules/es.array.map')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.string.split')

require('regenerator-runtime/runtime')

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

var path = require('path')

var TaskList = require('listr')

var chalk = require('chalk')

var _require = require('../helpers/truffle-runner')
var compileContracts = _require.compileContracts

var _require2 = require('../util')
var findProjectRoot = _require2.findProjectRoot

var _require3 = require('../helpers/web3-fallback')
var ensureWeb3 = _require3.ensureWeb3

var deployArtifacts = require('../helpers/truffle-deploy-artifacts')

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

var _require4 = require('../util')
var getRecommendedGasLimit = _require4.getRecommendedGasLimit

exports.command = 'deploy [contract]'
exports.describe = 'Deploys contract code of the app to the chain'

exports.arappContract = function() {
  var contractPath = require(path.resolve(findProjectRoot(), 'arapp.json')).path

  var contractName = path.basename(contractPath).split('.')[0]
  return contractName
}

exports.builder = function(yargs) {
  return yargs
    .positional('contract', {
      description:
        'Contract name (defaults to the contract at the path in arapp.json)',
    })
    .option('init', {
      description: 'Arguments to be passed to contract constructor',
      array: true,
      default: [],
    })
}

exports.task =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee4(_ref) {
        var network,
          gasPrice,
          cwd,
          contract,
          init,
          web3,
          apmOptions,
          silent,
          debug,
          mappingMask,
          mappings,
          processedInit,
          contractName,
          tasks
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch ((_context4.prev = _context4.next)) {
              case 0:
                ;(network = _ref.network),
                  (gasPrice = _ref.gasPrice),
                  (cwd = _ref.cwd),
                  (contract = _ref.contract),
                  (init = _ref.init),
                  (web3 = _ref.web3),
                  (apmOptions = _ref.apmOptions),
                  (silent = _ref.silent),
                  (debug = _ref.debug)

                if (!contract) {
                  contract = exports.arappContract()
                }

                apmOptions.ensRegistryAddress = apmOptions['ens-registry']

                if (web3) {
                  _context4.next = 7
                  break
                }

                _context4.next = 6
                return ensureWeb3(network)

              case 6:
                web3 = _context4.sent

              case 7:
                init = init || [] // Mappings allow to pass certain init parameters that get replaced for their actual value

                mappingMask = function mappingMask(key) {
                  return '@ARAGON_'.concat(key)
                }

                mappings = _defineProperty({}, mappingMask('ENS'), function() {
                  return apmOptions.ensRegistryAddress
                })
                processedInit = init.map(function(value) {
                  return mappings[value] ? mappings[value]() : value
                })
                contractName = contract
                tasks = new TaskList(
                  [
                    {
                      title: 'Compile contracts',
                      task: (function() {
                        var _task = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function _callee$(
                              _context
                            ) {
                              while (1) {
                                switch ((_context.prev = _context.next)) {
                                  case 0:
                                    _context.next = 2
                                    return compileContracts()

                                  case 2:
                                  case 'end':
                                    return _context.stop()
                                }
                              }
                            },
                            _callee)
                          })
                        )

                        function task() {
                          return _task.apply(this, arguments)
                        }

                        return task
                      })(),
                    },
                    {
                      title: "Deploy '".concat(contractName, "' to network"),
                      task: (function() {
                        var _task3 = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee2(
                            ctx,
                            _task2
                          ) {
                            var _ctx$contractArtifact,
                              abi,
                              bytecode,
                              contract,
                              accounts,
                              deployTx,
                              gas,
                              args,
                              deployPromise,
                              instance

                            return regeneratorRuntime.wrap(
                              function _callee2$(_context2) {
                                while (1) {
                                  switch ((_context2.prev = _context2.next)) {
                                    case 0:
                                      ctx.contractName = contractName
                                      _context2.prev = 1
                                      ctx.contractArtifacts = require(path.join(
                                        cwd,
                                        'build/contracts',
                                        contractName
                                      ))
                                      _context2.next = 8
                                      break

                                    case 5:
                                      _context2.prev = 5
                                      _context2.t0 = _context2['catch'](1)
                                      throw new Error(
                                        'Contract artifact couldnt be found. Please ensure your contract name is the same as the filename.'
                                      )

                                    case 8:
                                      ;(_ctx$contractArtifact =
                                        ctx.contractArtifacts),
                                        (abi = _ctx$contractArtifact.abi),
                                        (bytecode =
                                          _ctx$contractArtifact.bytecode)

                                      if (!(!bytecode || bytecode === '0x')) {
                                        _context2.next = 11
                                        break
                                      }

                                      throw new Error(
                                        'Contract bytecode couldnt be generated. Contracts that dont implement all interface methods cant be deployed'
                                      )

                                    case 11:
                                      _task2.output = "Deploying '".concat(
                                        contractName,
                                        "' to network"
                                      )
                                      contract = new web3.eth.Contract(abi, {
                                        data: bytecode,
                                      })
                                      _context2.next = 15
                                      return web3.eth.getAccounts()

                                    case 15:
                                      accounts = _context2.sent
                                      deployTx = contract.deploy({
                                        arguments: processedInit,
                                      })
                                      _context2.t1 = getRecommendedGasLimit
                                      _context2.t2 = web3
                                      _context2.next = 21
                                      return deployTx.estimateGas()

                                    case 21:
                                      _context2.t3 = _context2.sent
                                      _context2.next = 24
                                      return (0, _context2.t1)(
                                        _context2.t2,
                                        _context2.t3
                                      )

                                    case 24:
                                      gas = _context2.sent
                                      args = {
                                        from: accounts[0],
                                        gasPrice: network.gasPrice || gasPrice,
                                        gas: gas,
                                      }
                                      deployPromise = deployTx.send(args)
                                      deployPromise.on(
                                        'transactionHash',
                                        function(transactionHash) {
                                          ctx.transactionHash = transactionHash
                                        }
                                      )
                                      _context2.next = 30
                                      return deployPromise

                                    case 30:
                                      instance = _context2.sent

                                      if (instance.options.address) {
                                        _context2.next = 33
                                        break
                                      }

                                      throw new Error(
                                        'Contract deployment failed'
                                      )

                                    case 33:
                                      ctx.contractInstance = instance
                                      ctx.contract = instance.options.address
                                      return _context2.abrupt(
                                        'return',
                                        ctx.contract
                                      )

                                    case 36:
                                    case 'end':
                                      return _context2.stop()
                                  }
                                }
                              },
                              _callee2,
                              null,
                              [[1, 5]]
                            )
                          })
                        )

                        function task(_x2, _x3) {
                          return _task3.apply(this, arguments)
                        }

                        return task
                      })(),
                    },
                    {
                      title: 'Generate deployment artifacts',
                      task: (function() {
                        var _task5 = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee3(
                            ctx,
                            _task4
                          ) {
                            return regeneratorRuntime.wrap(function _callee3$(
                              _context3
                            ) {
                              while (1) {
                                switch ((_context3.prev = _context3.next)) {
                                  case 0:
                                    _context3.next = 2
                                    return deployArtifacts(
                                      ctx.contractArtifacts
                                    )

                                  case 2:
                                    ctx.deployArtifacts = _context3.sent
                                    ctx.deployArtifacts.transactionHash =
                                      ctx.transactionHash
                                    delete ctx.transactionHash

                                  case 5:
                                  case 'end':
                                    return _context3.stop()
                                }
                              }
                            },
                            _callee3)
                          })
                        )

                        function task(_x4, _x5) {
                          return _task5.apply(this, arguments)
                        }

                        return task
                      })(),
                    },
                  ],
                  listrOpts(silent, debug)
                )
                return _context4.abrupt('return', tasks)

              case 14:
              case 'end':
                return _context4.stop()
            }
          }
        }, _callee4)
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
      regeneratorRuntime.mark(function _callee5(_ref3) {
        var reporter,
          gasPrice,
          network,
          cwd,
          contract,
          init,
          apmOptions,
          silent,
          debug,
          task,
          ctx
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch ((_context5.prev = _context5.next)) {
              case 0:
                ;(reporter = _ref3.reporter),
                  (gasPrice = _ref3.gasPrice),
                  (network = _ref3.network),
                  (cwd = _ref3.cwd),
                  (contract = _ref3.contract),
                  (init = _ref3.init),
                  (apmOptions = _ref3.apm),
                  (silent = _ref3.silent),
                  (debug = _ref3.debug)
                _context5.next = 3
                return exports.task({
                  gasPrice: gasPrice,
                  network: network,
                  cwd: cwd,
                  contract: contract,
                  init: init,
                  apmOptions: apmOptions,
                  silent: silent,
                  debug: debug,
                })

              case 3:
                task = _context5.sent
                _context5.next = 6
                return task.run()

              case 6:
                ctx = _context5.sent
                reporter.success(
                  'Successfully deployed '
                    .concat(chalk.blue(ctx.contractName), ' at: ')
                    .concat(chalk.green(ctx.contract))
                )
                reporter.info(
                  'Transaction hash: '.concat(
                    chalk.blue(ctx.deployArtifacts.transactionHash)
                  )
                )
                process.exit()

              case 10:
              case 'end':
                return _context5.stop()
            }
          }
        }, _callee5)
      })
    )

    return function(_x6) {
      return _ref4.apply(this, arguments)
    }
  })()
// # sourceMappingURL=deploy.js.map
