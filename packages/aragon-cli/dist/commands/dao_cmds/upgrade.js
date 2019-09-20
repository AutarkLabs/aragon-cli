'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.string.bold')

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

var execTask = require('./utils/execHandler').task

var _require = require('./utils/aragonjs-wrapper')
var resolveEnsDomain = _require.resolveEnsDomain

var TaskList = require('listr')

var daoArg = require('./utils/daoArg')

var _require2 = require('../../helpers/web3-fallback')
var ensureWeb3 = _require2.ensureWeb3

var APM = require('@aragon/apm')

var defaultAPMName = require('@aragon/cli-utils/src/helpers/default-apm')

var chalk = require('chalk')

var startIPFS = require('../ipfs_cmds/start')

var getRepoTask = require('./utils/getRepoTask')

var _require3 = require('../../util')
var getContract = _require3.getContract

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

exports.command = 'upgrade <dao> <apmRepo> [apmRepoVersion]'
exports.describe = 'Upgrade an app into a DAO'

exports.builder = function(yargs) {
  return getRepoTask.args(daoArg(yargs))
}

exports.task =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee2(_ref) {
        var wsProvider,
          web3,
          reporter,
          gasPrice,
          dao,
          network,
          apmOptions,
          apmRepo,
          apmRepoVersion,
          repo,
          silent,
          debug,
          apm,
          tasks
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                ;(wsProvider = _ref.wsProvider),
                  (web3 = _ref.web3),
                  (reporter = _ref.reporter),
                  (gasPrice = _ref.gasPrice),
                  (dao = _ref.dao),
                  (network = _ref.network),
                  (apmOptions = _ref.apmOptions),
                  (apmRepo = _ref.apmRepo),
                  (apmRepoVersion = _ref.apmRepoVersion),
                  (repo = _ref.repo),
                  (silent = _ref.silent),
                  (debug = _ref.debug)
                apmOptions.ensRegistryAddress = apmOptions['ens-registry']
                _context2.next = 4
                return APM(web3, apmOptions)

              case 4:
                apm = _context2.sent
                apmRepo = defaultAPMName(apmRepo)

                if (!/0x[a-fA-F0-9]{40}/.test(dao)) {
                  _context2.next = 10
                  break
                }

                _context2.t0 = dao
                _context2.next = 13
                break

              case 10:
                _context2.next = 12
                return resolveEnsDomain(dao, {
                  provider: web3.currentProvider,
                  registryAddress: apmOptions.ensRegistryAddress,
                })

              case 12:
                _context2.t0 = _context2.sent

              case 13:
                dao = _context2.t0
                tasks = new TaskList(
                  [
                    {
                      // IPFS is a dependency of getRepoTask which uses IPFS to fetch the contract ABI
                      title: 'Check IPFS',
                      task: function task() {
                        return startIPFS.task({
                          apmOptions: apmOptions,
                        })
                      },
                    },
                    {
                      title: 'Fetching '
                        .concat(chalk.bold(apmRepo), '@')
                        .concat(apmRepoVersion),
                      skip: function skip(ctx) {
                        return ctx.repo
                      },
                      // only run if repo isn't passed
                      task: getRepoTask.task({
                        apm: apm,
                        apmRepo: apmRepo,
                        apmRepoVersion: apmRepoVersion,
                      }),
                    },
                    {
                      title: 'Upgrading app',
                      task: (function() {
                        var _task = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee(ctx) {
                            var kernel, basesNamespace, getTransactionPath
                            return regeneratorRuntime.wrap(function _callee$(
                              _context
                            ) {
                              while (1) {
                                switch ((_context.prev = _context.next)) {
                                  case 0:
                                    kernel = new web3.eth.Contract(
                                      getContract('@aragon/os', 'Kernel').abi,
                                      dao
                                    )
                                    _context.next = 3
                                    return kernel.methods
                                      .APP_BASES_NAMESPACE()
                                      .call()

                                  case 3:
                                    basesNamespace = _context.sent

                                    getTransactionPath = function getTransactionPath(
                                      wrapper
                                    ) {
                                      var fnArgs = [
                                        basesNamespace,
                                        ctx.repo.appId,
                                        ctx.repo.contractAddress,
                                      ]
                                      return wrapper.getTransactionPath(
                                        dao,
                                        'setApp',
                                        fnArgs
                                      )
                                    }

                                    return _context.abrupt(
                                      'return',
                                      execTask(dao, getTransactionPath, {
                                        ipfsCheck: false,
                                        reporter: reporter,
                                        gasPrice: gasPrice,
                                        apm: apmOptions,
                                        web3: web3,
                                        wsProvider: wsProvider,
                                      })
                                    )

                                  case 6:
                                  case 'end':
                                    return _context.stop()
                                }
                              }
                            },
                            _callee)
                          })
                        )

                        function task(_x2) {
                          return _task.apply(this, arguments)
                        }

                        return task
                      })(),
                    },
                  ],
                  listrOpts(silent, debug)
                )
                return _context2.abrupt('return', tasks)

              case 16:
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
          dao,
          gasPrice,
          network,
          wsProvider,
          apmOptions,
          apmRepo,
          apmRepoVersion,
          silent,
          debug,
          web3,
          task
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                ;(reporter = _ref3.reporter),
                  (dao = _ref3.dao),
                  (gasPrice = _ref3.gasPrice),
                  (network = _ref3.network),
                  (wsProvider = _ref3.wsProvider),
                  (apmOptions = _ref3.apm),
                  (apmRepo = _ref3.apmRepo),
                  (apmRepoVersion = _ref3.apmRepoVersion),
                  (silent = _ref3.silent),
                  (debug = _ref3.debug)
                _context3.next = 3
                return ensureWeb3(network)

              case 3:
                web3 = _context3.sent
                apmOptions.ensRegistryAddress = apmOptions['ens-registry']
                _context3.next = 7
                return exports.task({
                  web3: web3,
                  reporter: reporter,
                  dao: dao,
                  gasPrice: gasPrice,
                  network: network,
                  apmOptions: apmOptions,
                  apmRepo: apmRepo,
                  apmRepoVersion: apmRepoVersion,
                  wsProvider: wsProvider,
                  silent: silent,
                  debug: debug,
                })

              case 7:
                task = _context3.sent
                return _context3.abrupt(
                  'return',
                  task.run().then(function(ctx) {
                    reporter.success(
                      'Successfully executed: "'.concat(
                        chalk.blue(ctx.transactionPath[0].description),
                        '"'
                      )
                    )
                    process.exit()
                  })
                )

              case 9:
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
// # sourceMappingURL=upgrade.js.map
