'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.find')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.array.join')

require('core-js/modules/es.array.map')

require('core-js/modules/es.function.name')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.string.iterator')

require('core-js/modules/es.string.bold')

require('core-js/modules/web.dom-collections.iterator')

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

var encodeInitPayload = require('./utils/encodeInitPayload')

var _require3 = require('../../util')
var getContract = _require3.getContract
var ANY_ENTITY = _require3.ANY_ENTITY
var NO_MANAGER = _require3.NO_MANAGER
var ZERO_ADDRESS = _require3.ZERO_ADDRESS

var kernelABI = require('@aragon/os/abi/Kernel').abi

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

var addressesEqual = function addressesEqual(a, b) {
  return a.toLowerCase() === b.toLowerCase()
}

exports.command = 'install <dao> <apmRepo> [apmRepoVersion]'
exports.describe = 'Install an app into a DAO'

exports.builder = function(yargs) {
  return getRepoTask
    .args(daoArg(yargs))
    .option('app-init', {
      description:
        'Name of the function that will be called to initialize an app. Set it to "none" to skip initialization',
      default: 'initialize',
    })
    .option('app-init-args', {
      description: 'Arguments for calling the app init function',
      array: true,
      default: [],
    })
    .options('set-permissions', {
      description:
        'Whether to set permissions in the app. Set it to "open" to allow ANY_ENTITY on all roles.',
      choices: ['open'],
    })
}

exports.task =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee6(_ref) {
        var wsProvider,
          web3,
          reporter,
          dao,
          gasPrice,
          network,
          apmOptions,
          apmRepo,
          apmRepoVersion,
          appInit,
          appInitArgs,
          setPermissions,
          silent,
          debug,
          apm,
          kernel,
          tasks
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch ((_context6.prev = _context6.next)) {
              case 0:
                ;(wsProvider = _ref.wsProvider),
                  (web3 = _ref.web3),
                  (reporter = _ref.reporter),
                  (dao = _ref.dao),
                  (gasPrice = _ref.gasPrice),
                  (network = _ref.network),
                  (apmOptions = _ref.apmOptions),
                  (apmRepo = _ref.apmRepo),
                  (apmRepoVersion = _ref.apmRepoVersion),
                  (appInit = _ref.appInit),
                  (appInitArgs = _ref.appInitArgs),
                  (setPermissions = _ref.setPermissions),
                  (silent = _ref.silent),
                  (debug = _ref.debug)
                apmOptions.ensRegistryAddress = apmOptions['ens-registry']
                _context6.next = 4
                return APM(web3, apmOptions)

              case 4:
                apm = _context6.sent
                apmRepo = defaultAPMName(apmRepo)

                if (!/0x[a-fA-F0-9]{40}/.test(dao)) {
                  _context6.next = 10
                  break
                }

                _context6.t0 = dao
                _context6.next = 13
                break

              case 10:
                _context6.next = 12
                return resolveEnsDomain(dao, {
                  provider: web3.currentProvider,
                  registryAddress: apmOptions.ensRegistryAddress,
                })

              case 12:
                _context6.t0 = _context6.sent

              case 13:
                dao = _context6.t0
                kernel = new web3.eth.Contract(
                  getContract('@aragon/os', 'Kernel').abi,
                  dao
                )
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
                      task: getRepoTask.task({
                        apm: apm,
                        apmRepo: apmRepo,
                        apmRepoVersion: apmRepoVersion,
                      }),
                    },
                    {
                      title: 'Checking installed version',
                      task: (function() {
                        var _task2 = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee(ctx, _task) {
                            var basesNamespace, currentBase
                            return regeneratorRuntime.wrap(function _callee$(
                              _context
                            ) {
                              while (1) {
                                switch ((_context.prev = _context.next)) {
                                  case 0:
                                    _context.next = 2
                                    return kernel.methods
                                      .APP_BASES_NAMESPACE()
                                      .call()

                                  case 2:
                                    basesNamespace = _context.sent
                                    _context.next = 5
                                    return kernel.methods
                                      .getApp(basesNamespace, ctx.repo.appId)
                                      .call()

                                  case 5:
                                    currentBase = _context.sent

                                    if (!(currentBase === ZERO_ADDRESS)) {
                                      _context.next = 9
                                      break
                                    }

                                    _task.skip(
                                      'Installing the first instance of '.concat(
                                        apmRepo,
                                        ' in DAO'
                                      )
                                    )

                                    return _context.abrupt('return')

                                  case 9:
                                    if (
                                      addressesEqual(
                                        currentBase,
                                        ctx.repo.contractAddress
                                      )
                                    ) {
                                      _context.next = 11
                                      break
                                    }

                                    throw new Error(
                                      'Cannot install app on a different version. Currently installed version for '
                                        .concat(apmRepo, ' in the DAO is ')
                                        .concat(
                                          currentBase,
                                          "\n Please upgrade using 'dao upgrade' first or install a different version."
                                        )
                                    )

                                  case 11:
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
                      title: 'Deploying app instance',
                      task: (function() {
                        var _task3 = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee2(ctx) {
                            var initPayload, getTransactionPath
                            return regeneratorRuntime.wrap(function _callee2$(
                              _context2
                            ) {
                              while (1) {
                                switch ((_context2.prev = _context2.next)) {
                                  case 0:
                                    initPayload = encodeInitPayload(
                                      web3,
                                      ctx.repo.abi,
                                      appInit,
                                      appInitArgs
                                    )

                                    if (initPayload === '0x') {
                                      ctx.notInitialized = true
                                    }

                                    getTransactionPath = function getTransactionPath(
                                      wrapper
                                    ) {
                                      var fnArgs = [
                                        ctx.repo.appId,
                                        ctx.repo.contractAddress,
                                        initPayload,
                                        false,
                                      ]
                                      return wrapper.getTransactionPath(
                                        dao,
                                        'newAppInstance',
                                        fnArgs
                                      )
                                    }

                                    return _context2.abrupt(
                                      'return',
                                      execTask(dao, getTransactionPath, {
                                        ipfsCheck: false,
                                        reporter: reporter,
                                        gasPrice: gasPrice,
                                        apm: apmOptions,
                                        web3: web3,
                                        wsProvider: wsProvider,
                                        silent: silent,
                                        debug: debug,
                                      })
                                    )

                                  case 4:
                                  case 'end':
                                    return _context2.stop()
                                }
                              }
                            },
                            _callee2)
                          })
                        )

                        function task(_x4) {
                          return _task3.apply(this, arguments)
                        }

                        return task
                      })(),
                    },
                    {
                      title: 'Fetching deployed app',
                      task: (function() {
                        var _task5 = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee3(
                            ctx,
                            _task4
                          ) {
                            var logABI, logSignature, logTopic, deployLog, log
                            return regeneratorRuntime.wrap(function _callee3$(
                              _context3
                            ) {
                              while (1) {
                                switch ((_context3.prev = _context3.next)) {
                                  case 0:
                                    logABI = kernelABI.find(function(_ref3) {
                                      var type = _ref3.type
                                      var name = _ref3.name
                                      return (
                                        type === 'event' &&
                                        name === 'NewAppProxy'
                                      )
                                    })

                                    if (logABI) {
                                      _context3.next = 3
                                      break
                                    }

                                    throw new Error(
                                      'Kernel ABI in aragon.js doesnt contain NewAppProxy log'
                                    )

                                  case 3:
                                    logSignature = ''
                                      .concat(logABI.name, '(')
                                      .concat(
                                        logABI.inputs
                                          .map(function(i) {
                                            return i.type
                                          })
                                          .join(','),
                                        ')'
                                      )
                                    logTopic = web3.utils.sha3(logSignature)
                                    deployLog = ctx.receipt.logs.find(function(
                                      _ref4
                                    ) {
                                      var topics = _ref4.topics
                                      var address = _ref4.address
                                      return (
                                        topics[0] === logTopic &&
                                        addressesEqual(dao, address)
                                      )
                                    })

                                    if (deployLog) {
                                      _context3.next = 9
                                      break
                                    }

                                    _task4.skip(
                                      "App wasn't deployed in transaction."
                                    )

                                    return _context3.abrupt('return')

                                  case 9:
                                    log = web3.eth.abi.decodeLog(
                                      logABI.inputs,
                                      deployLog.data
                                    )
                                    ctx.appAddress = log.proxy

                                  case 11:
                                  case 'end':
                                    return _context3.stop()
                                }
                              }
                            },
                            _callee3)
                          })
                        )

                        function task(_x5, _x6) {
                          return _task5.apply(this, arguments)
                        }

                        return task
                      })(),
                    },
                    {
                      title: 'Set permissions',
                      enabled: function enabled(ctx) {
                        return setPermissions === 'open' && ctx.appAddress
                      },
                      task: (function() {
                        var _task7 = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee5(
                            ctx,
                            _task6
                          ) {
                            var permissions
                            return regeneratorRuntime.wrap(function _callee5$(
                              _context5
                            ) {
                              while (1) {
                                switch ((_context5.prev = _context5.next)) {
                                  case 0:
                                    if (
                                      !(
                                        !ctx.repo.roles ||
                                        ctx.repo.roles.length === 0
                                      )
                                    ) {
                                      _context5.next = 2
                                      break
                                    }

                                    throw new Error(
                                      'You have no roles defined in your arapp.json.\nThis is required for your app to be properly installed.\nSee https://hack.aragon.org/docs/cli-global-confg#the-arappjson-file for more information.'
                                    )

                                  case 2:
                                    permissions = ctx.repo.roles.map(function(
                                      role
                                    ) {
                                      return [
                                        ANY_ENTITY,
                                        ctx.appAddress,
                                        role.bytes,
                                        NO_MANAGER,
                                      ]
                                    })

                                    if (ctx.accounts) {
                                      _context5.next = 7
                                      break
                                    }

                                    _context5.next = 6
                                    return web3.eth.getAccounts()

                                  case 6:
                                    ctx.accounts = _context5.sent

                                  case 7:
                                    return _context5.abrupt(
                                      'return',
                                      Promise.all(
                                        permissions.map(function(params) {
                                          var getTransactionPath =
                                            /* #__PURE__ */
                                            (function() {
                                              var _ref5 = _asyncToGenerator(
                                                /* #__PURE__ */
                                                regeneratorRuntime.mark(
                                                  function _callee4(wrapper) {
                                                    return regeneratorRuntime.wrap(
                                                      function _callee4$(
                                                        _context4
                                                      ) {
                                                        while (1) {
                                                          switch (
                                                            (_context4.prev =
                                                              _context4.next)
                                                          ) {
                                                            case 0:
                                                              return _context4.abrupt(
                                                                'return',
                                                                wrapper.getACLTransactionPath(
                                                                  'createPermission',
                                                                  params
                                                                )
                                                              )

                                                            case 1:
                                                            case 'end':
                                                              return _context4.stop()
                                                          }
                                                        }
                                                      },
                                                      _callee4
                                                    )
                                                  }
                                                )
                                              )

                                              return function getTransactionPath(
                                                _x9
                                              ) {
                                                return _ref5.apply(
                                                  this,
                                                  arguments
                                                )
                                              }
                                            })()

                                          return execTask(
                                            dao,
                                            getTransactionPath,
                                            {
                                              reporter: reporter,
                                              gasPrice: gasPrice,
                                              apm: apmOptions,
                                              web3: web3,
                                              wsProvider: wsProvider,
                                              silent: silent,
                                              debug: debug,
                                            }
                                          ) // execTask returns a TaskList not a promise
                                            .then(function(tasks) {
                                              return tasks.run()
                                            })
                                        })
                                      )
                                    )

                                  case 8:
                                  case 'end':
                                    return _context5.stop()
                                }
                              }
                            },
                            _callee5)
                          })
                        )

                        function task(_x7, _x8) {
                          return _task7.apply(this, arguments)
                        }

                        return task
                      })(),
                    },
                  ],
                  listrOpts(silent, debug)
                )
                return _context6.abrupt('return', tasks)

              case 17:
              case 'end':
                return _context6.stop()
            }
          }
        }, _callee6)
      })
    )

    return function(_x) {
      return _ref2.apply(this, arguments)
    }
  })()

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref7 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee7(_ref6) {
        var reporter,
          dao,
          gasPrice,
          network,
          apmOptions,
          apmRepo,
          apmRepoVersion,
          appInit,
          appInitArgs,
          setPermissions,
          wsProvider,
          silent,
          debug,
          web3,
          task
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch ((_context7.prev = _context7.next)) {
              case 0:
                ;(reporter = _ref6.reporter),
                  (dao = _ref6.dao),
                  (gasPrice = _ref6.gasPrice),
                  (network = _ref6.network),
                  (apmOptions = _ref6.apm),
                  (apmRepo = _ref6.apmRepo),
                  (apmRepoVersion = _ref6.apmRepoVersion),
                  (appInit = _ref6.appInit),
                  (appInitArgs = _ref6.appInitArgs),
                  (setPermissions = _ref6.setPermissions),
                  (wsProvider = _ref6.wsProvider),
                  (silent = _ref6.silent),
                  (debug = _ref6.debug)
                _context7.next = 3
                return ensureWeb3(network)

              case 3:
                web3 = _context7.sent
                _context7.next = 6
                return exports.task({
                  web3: web3,
                  reporter: reporter,
                  dao: dao,
                  gasPrice: gasPrice,
                  network: network,
                  apmOptions: apmOptions,
                  apmRepo: apmRepo,
                  apmRepoVersion: apmRepoVersion,
                  appInit: appInit,
                  appInitArgs: appInitArgs,
                  setPermissions: setPermissions,
                  wsProvider: wsProvider,
                  silent: silent,
                  debug: debug,
                })

              case 6:
                task = _context7.sent
                return _context7.abrupt(
                  'return',
                  task.run().then(function(ctx) {
                    reporter.info(
                      'Successfully executed: "'.concat(
                        chalk.blue(ctx.transactionPath[0].description),
                        '"'
                      )
                    )

                    if (ctx.appAddress) {
                      reporter.success(
                        'Installed '
                          .concat(chalk.blue(apmRepo), ' at: ')
                          .concat(chalk.green(ctx.appAddress))
                      )
                    } else {
                      reporter.warning(
                        'After the app instance is created, you will need to assign permissions to it for it appear as an app in the DAO'
                      )
                    }

                    if (ctx.notInitialized) {
                      reporter.warning(
                        'App could not be initialized, check the --app-init flag. Functions protected behind the ACL will not work until the app is initialized'
                      )
                    }

                    process.exit()
                  })
                )

              case 8:
              case 'end':
                return _context7.stop()
            }
          }
        }, _callee7)
      })
    )

    return function(_x10) {
      return _ref7.apply(this, arguments)
    }
  })()
// # sourceMappingURL=install.js.map
