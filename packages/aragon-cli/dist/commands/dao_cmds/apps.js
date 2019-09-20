'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.filter')

require('core-js/modules/es.array.find')

require('core-js/modules/es.array.for-each')

require('core-js/modules/es.array.map')

require('core-js/modules/es.date.to-string')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.replace')

require('core-js/modules/web.dom-collections.for-each')

require('regenerator-runtime/runtime')

var _aragonjsWrapper = _interopRequireDefault(
  require('./utils/aragonjs-wrapper')
)

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

var TaskList = require('listr')

var chalk = require('chalk')

var daoArg = require('./utils/daoArg')

var _require = require('./utils/knownApps')
var listApps = _require.listApps

var _require2 = require('../../helpers/web3-fallback')
var ensureWeb3 = _require2.ensureWeb3

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

var _require3 = require('../../util')
var getContract = _require3.getContract

var Table = require('cli-table')

var addressesEqual = function addressesEqual(a, b) {
  return a.toLowerCase() === b.toLowerCase()
}

var knownApps
exports.command = 'apps <dao>'
exports.describe = 'Get all the apps in a DAO'

exports.builder = function(yargs) {
  return daoArg(yargs).option('all', {
    description: 'Whether to include apps without permissions as well',
    boolean: true,
  })
}

var printAppNameFromAppId = function printAppNameFromAppId(appId) {
  return knownApps[appId] ? chalk.blue(knownApps[appId]) : appId
}

var printAppNameAndVersion = function printAppNameAndVersion(appName, version) {
  return version
    ? chalk.blue(''.concat(appName, '@v').concat(version))
    : chalk.blue(appName)
}

var printContent = function printContent(content) {
  if (!content) {
    return '(No UI available)'
  }

  return ''.concat(content.provider, ':').concat(content.location)
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee2(_ref) {
        var reporter,
          dao,
          all,
          network,
          apmOptions,
          wsProvider,
          module,
          silent,
          debug,
          web3,
          tasks
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                ;(reporter = _ref.reporter),
                  (dao = _ref.dao),
                  (all = _ref.all),
                  (network = _ref.network),
                  (apmOptions = _ref.apm),
                  (wsProvider = _ref.wsProvider),
                  (module = _ref.module),
                  (silent = _ref.silent),
                  (debug = _ref.debug)
                knownApps = listApps(module ? [module.appName] : [])
                _context2.next = 4
                return ensureWeb3(network)

              case 4:
                web3 = _context2.sent
                tasks = new TaskList(
                  [
                    {
                      title: 'Inspecting DAO',
                      task: function task(ctx, _task) {
                        _task.output = 'Fetching apps for '.concat(dao, '...')
                        return new Promise(function(resolve, reject) {
                          ;(0, _aragonjsWrapper['default'])(
                            dao,
                            apmOptions['ens-registry'],
                            {
                              provider: wsProvider || web3.currentProvider,
                              onApps: function onApps(apps) {
                                ctx.apps = apps
                                resolve()
                              },
                              onDaoAddress: function onDaoAddress(addr) {
                                ctx.daoAddress = addr
                              },
                              onError: function onError(err) {
                                return reject(err)
                              },
                            }
                          )['catch'](function(err) {
                            reporter.error('Error inspecting DAO apps')
                            reporter.debug(err)
                            process.exit(1)
                          })
                        })
                      },
                    },
                    {
                      title: 'Fetching permissionless apps',
                      enabled: function enabled() {
                        return all
                      },
                      task: (function() {
                        var _task3 = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee(
                            ctx,
                            _task2
                          ) {
                            var kernel, events
                            return regeneratorRuntime.wrap(function _callee$(
                              _context
                            ) {
                              while (1) {
                                switch ((_context.prev = _context.next)) {
                                  case 0:
                                    kernel = new web3.eth.Contract(
                                      getContract('@aragon/os', 'Kernel').abi,
                                      ctx.daoAddress
                                    )
                                    _context.t0 = kernel
                                    _context.next = 4
                                    return kernel.methods
                                      .getInitializationBlock()
                                      .call()

                                  case 4:
                                    _context.t1 = _context.sent
                                    _context.t2 = {
                                      fromBlock: _context.t1,
                                      toBlock: 'latest',
                                    }
                                    _context.next = 8
                                    return _context.t0.getPastEvents.call(
                                      _context.t0,
                                      'NewAppProxy',
                                      _context.t2
                                    )

                                  case 8:
                                    events = _context.sent
                                    ctx.appsWithoutPermissions = events
                                      .map(function(event) {
                                        return {
                                          proxyAddress:
                                            event.returnValues.proxy,
                                          appId: event.returnValues.appId,
                                        }
                                      }) // Remove apps that have permissions
                                      .filter(function(_ref3) {
                                        var proxyAddress = _ref3.proxyAddress
                                        return !ctx.apps.find(function(app) {
                                          return addressesEqual(
                                            app.proxyAddress,
                                            proxyAddress
                                          )
                                        })
                                      })

                                  case 10:
                                  case 'end':
                                    return _context.stop()
                                }
                              }
                            },
                            _callee)
                          })
                        )

                        function task(_x2, _x3) {
                          return _task3.apply(this, arguments)
                        }

                        return task
                      })(),
                    },
                  ],
                  listrOpts(silent, debug)
                )
                return _context2.abrupt(
                  'return',
                  tasks.run().then(function(ctx) {
                    reporter.success(
                      'Successfully fetched DAO apps for '.concat(
                        chalk.green(ctx.daoAddress)
                      )
                    )
                    var appsContent = ctx.apps
                      .map(function(_ref4) {
                        var appId = _ref4.appId
                        var proxyAddress = _ref4.proxyAddress
                        var codeAddress = _ref4.codeAddress
                        var content = _ref4.content
                        var appName = _ref4.appName
                        var version = _ref4.version
                        return [
                          appName
                            ? printAppNameAndVersion(appName, version)
                            : printAppNameFromAppId(appId),
                          proxyAddress,
                          printContent(content),
                        ]
                      }) // filter registry name to make it shorter
                      // TODO: Add flag to turn off
                      .map(function(row) {
                        row[0] = row[0].replace('.aragonpm.eth', '')
                        return row
                      })
                    var table = new Table({
                      head: ['App', 'Proxy address', 'Content'].map(function(
                        x
                      ) {
                        return chalk.white(x)
                      }),
                    })
                    appsContent.forEach(function(row) {
                      return table.push(row)
                    })
                    console.log(table.toString()) // Print permisionless apps

                    if (ctx.appsWithoutPermissions) {
                      var tableForPermissionlessApps = new Table({
                        head: ['Permissionless app', 'Proxy address'].map(
                          function(x) {
                            return chalk.white(x)
                          }
                        ),
                      })
                      ctx.appsWithoutPermissions.forEach(function(app) {
                        return tableForPermissionlessApps.push([
                          printAppNameFromAppId(app.appId).replace(
                            '.aragonpm.eth',
                            ''
                          ),
                          app.proxyAddress,
                        ])
                      })
                      console.log(tableForPermissionlessApps.toString())
                    }

                    process.exit() // force exit, as aragonjs hangs
                  })
                )

              case 7:
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
// # sourceMappingURL=apps.js.map
