'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.symbol.iterator')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.from')

require('core-js/modules/es.array.is-array')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.date.to-string')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.iterator')

require('core-js/modules/es.string.bold')

require('core-js/modules/web.dom-collections.iterator')

require('regenerator-runtime/runtime')

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  )
}

function _nonIterableSpread() {
  throw new TypeError('Invalid attempt to spread non-iterable instance')
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === '[object Arguments]'
  )
    return Array.from(iter)
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i]
    }
    return arr2
  }
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

var _require = require('../../helpers/web3-fallback')
var ensureWeb3 = _require.ensureWeb3

var APM = require('@aragon/apm')

var defaultAPMName = require('@aragon/cli-utils/src/helpers/default-apm')

var _require2 = require('chalk')
var green = _require2.green
var bold = _require2.bold

var _require3 = require('../../util')
var getContract = _require3.getContract

var getRepoTask = require('./utils/getRepoTask')

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

var startIPFS = require('../ipfs_cmds/start')

var _require4 = require('../../util')
var getRecommendedGasLimit = _require4.getRecommendedGasLimit

var assignIdTask = require('./id-assign').task

exports.BARE_TEMPLATE = defaultAPMName('bare-template')
exports.BARE_INSTANCE_FUNCTION = 'newInstance'
exports.BARE_TEMPLATE_DEPLOY_EVENT = 'DeployDao'
exports.OLD_BARE_TEMPLATE = defaultAPMName('bare-kit')
exports.OLD_BARE_INSTANCE_FUNCTION = 'newBareInstance'
exports.OLD_BARE_TEMPLATE_DEPLOY_EVENT = 'DeployInstance' // TODO: Remove old template once is no longer supported

var BARE_TEMPLATE_ABI = require('./utils/bare-template-abi')

var OLD_BARE_TEMPLATE_ABI = require('./utils/old-bare-template-abi')

exports.command = 'new [template] [template-version]'
exports.describe = 'Create a new DAO'

exports.builder = function(yargs) {
  return yargs
    .positional('kit', {
      description: 'Name of the kit to use creating the DAO',
    })
    .positional('kit-version', {
      description: 'Version of the kit to be used',
    })
    .positional('template', {
      description: 'Name of the template to use creating the DAO',
      default: exports.BARE_TEMPLATE,
    })
    .positional('template-version', {
      description: 'Version of the template to be used',
      default: 'latest',
    })
    .option('fn-args', {
      description:
        'Arguments to be passed to the newInstance function (or the function passed with --fn)',
      array: true,
      default: [],
    })
    .option('fn', {
      description: 'Function to be called to create instance',
      default: exports.BARE_INSTANCE_FUNCTION,
    })
    .option('deploy-event', {
      description: 'Event name that the template will fire on success',
      default: exports.BARE_TEMPLATE_DEPLOY_EVENT,
    })
    .option('ipfs-check', {
      description: 'Whether to have new start IPFS if not started',
      boolean: true,
      default: true,
    })
    .option('aragon-id', {
      description: 'Assign an Aragon Id to the DAO',
      type: 'string',
    })
}

exports.task =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee4(_ref) {
        var web3,
          reporter,
          gasPrice,
          apmOptions,
          template,
          templateVersion,
          fn,
          fnArgs,
          skipChecks,
          deployEvent,
          templateInstance,
          silent,
          debug,
          ipfsCheck,
          aragonId,
          apm,
          bareTemplateABI,
          tasks
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch ((_context4.prev = _context4.next)) {
              case 0:
                ;(web3 = _ref.web3),
                  (reporter = _ref.reporter),
                  (gasPrice = _ref.gasPrice),
                  (apmOptions = _ref.apmOptions),
                  (template = _ref.template),
                  (templateVersion = _ref.templateVersion),
                  (fn = _ref.fn),
                  (fnArgs = _ref.fnArgs),
                  (skipChecks = _ref.skipChecks),
                  (deployEvent = _ref.deployEvent),
                  (templateInstance = _ref.templateInstance),
                  (silent = _ref.silent),
                  (debug = _ref.debug),
                  (ipfsCheck = _ref.ipfsCheck),
                  (aragonId = _ref.aragonId)
                apmOptions.ensRegistryAddress = apmOptions['ens-registry']
                _context4.next = 4
                return APM(web3, apmOptions)

              case 4:
                apm = _context4.sent
                template = defaultAPMName(template)
                bareTemplateABI = BARE_TEMPLATE_ABI

                if (template === exports.OLD_BARE_TEMPLATE) {
                  fn = exports.OLD_BARE_INSTANCE_FUNCTION
                  deployEvent = exports.OLD_BARE_TEMPLATE_DEPLOY_EVENT
                  bareTemplateABI = OLD_BARE_TEMPLATE_ABI
                }

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
                      enabled: function enabled() {
                        return ipfsCheck
                      },
                    },
                    {
                      title: 'Fetching template '
                        .concat(bold(template), '@')
                        .concat(templateVersion),
                      task: getRepoTask.task({
                        apm: apm,
                        apmRepo: template,
                        apmRepoVersion: templateVersion,
                        artifactRequired: false,
                      }),
                      enabled: function enabled() {
                        return !templateInstance
                      },
                    },
                    {
                      title: 'Create new DAO from template',
                      task: (function() {
                        var _task2 = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee(ctx, _task) {
                            var _template$methods

                            var abi,
                              template,
                              newInstanceTx,
                              estimatedGas,
                              _ref3,
                              events,
                              deployEventValue

                            return regeneratorRuntime.wrap(function _callee$(
                              _context
                            ) {
                              while (1) {
                                switch ((_context.prev = _context.next)) {
                                  case 0:
                                    if (ctx.accounts) {
                                      _context.next = 4
                                      break
                                    }

                                    _context.next = 3
                                    return web3.eth.getAccounts()

                                  case 3:
                                    ctx.accounts = _context.sent

                                  case 4:
                                    abi = ctx.repo.abi || bareTemplateABI
                                    template =
                                      templateInstance ||
                                      new web3.eth.Contract(
                                        abi,
                                        ctx.repo.contractAddress
                                      )
                                    newInstanceTx = (_template$methods =
                                      template.methods)[fn].apply(
                                      _template$methods,
                                      _toConsumableArray(fnArgs)
                                    )
                                    _context.next = 9
                                    return newInstanceTx.estimateGas()

                                  case 9:
                                    estimatedGas = _context.sent
                                    _context.t0 = newInstanceTx
                                    _context.t1 = ctx.accounts[0]
                                    _context.next = 14
                                    return getRecommendedGasLimit(
                                      web3,
                                      estimatedGas
                                    )

                                  case 14:
                                    _context.t2 = _context.sent
                                    _context.t3 = gasPrice
                                    _context.t4 = {
                                      from: _context.t1,
                                      gas: _context.t2,
                                      gasPrice: _context.t3,
                                    }
                                    _context.next = 19
                                    return _context.t0.send.call(
                                      _context.t0,
                                      _context.t4
                                    )

                                  case 19:
                                    _ref3 = _context.sent
                                    events = _ref3.events
                                    deployEventValue =
                                      events[deployEvent] ||
                                      events[
                                        exports.OLD_BARE_TEMPLATE_DEPLOY_EVENT
                                      ] // TODO: Include link to documentation

                                    if (
                                      events[
                                        exports.OLD_BARE_TEMPLATE_DEPLOY_EVENT
                                      ]
                                    )
                                      reporter.warning(
                                        "The use of kits was deprecated and templates should be used instead. The 'DeployInstance' event was replaced, 'DeployDao' should be used instead."
                                      )
                                    if (deployEventValue)
                                      ctx.daoAddress =
                                        deployEventValue.returnValues.dao
                                    else {
                                      reporter.error(
                                        'Could not find deploy event: '.concat(
                                          deployEvent
                                        )
                                      )
                                      process.exit(1)
                                    }

                                  case 24:
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
                      title: 'Checking DAO',
                      skip: function skip() {
                        return skipChecks
                      },
                      task: (function() {
                        var _task4 = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee2(
                            ctx,
                            _task3
                          ) {
                            var kernel
                            return regeneratorRuntime.wrap(function _callee2$(
                              _context2
                            ) {
                              while (1) {
                                switch ((_context2.prev = _context2.next)) {
                                  case 0:
                                    kernel = new web3.eth.Contract(
                                      getContract('@aragon/os', 'Kernel').abi,
                                      ctx.daoAddress
                                    )
                                    _context2.next = 3
                                    return kernel.methods.acl().call()

                                  case 3:
                                    ctx.aclAddress = _context2.sent
                                    _context2.next = 6
                                    return kernel.methods
                                      .APP_MANAGER_ROLE()
                                      .call()

                                  case 6:
                                    ctx.appManagerRole = _context2.sent

                                  case 7:
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
                    {
                      title: 'Assigning Aragon Id',
                      enabled: function enabled() {
                        return aragonId
                      },
                      task: (function() {
                        var _task5 = _asyncToGenerator(
                          /* #__PURE__ */
                          regeneratorRuntime.mark(function _callee3(ctx) {
                            return regeneratorRuntime.wrap(function _callee3$(
                              _context3
                            ) {
                              while (1) {
                                switch ((_context3.prev = _context3.next)) {
                                  case 0:
                                    return _context3.abrupt(
                                      'return',
                                      assignIdTask({
                                        dao: ctx.daoAddress,
                                        aragonId: aragonId,
                                        web3: web3,
                                        gasPrice: gasPrice,
                                        apmOptions: apmOptions,
                                        silent: silent,
                                        debug: debug,
                                        reporter: reporter,
                                      })
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

                        function task(_x6) {
                          return _task5.apply(this, arguments)
                        }

                        return task
                      })(),
                    },
                  ],
                  listrOpts(silent, debug)
                )
                return _context4.abrupt('return', tasks)

              case 10:
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
    var _ref5 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee5(_ref4) {
        var reporter,
          network,
          kit,
          kitVersion,
          template,
          templateVersion,
          fn,
          fnArgs,
          deployEvent,
          apmOptions,
          aragonId,
          silent,
          debug,
          web3,
          task
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch ((_context5.prev = _context5.next)) {
              case 0:
                ;(reporter = _ref4.reporter),
                  (network = _ref4.network),
                  (kit = _ref4.kit),
                  (kitVersion = _ref4.kitVersion),
                  (template = _ref4.template),
                  (templateVersion = _ref4.templateVersion),
                  (fn = _ref4.fn),
                  (fnArgs = _ref4.fnArgs),
                  (deployEvent = _ref4.deployEvent),
                  (apmOptions = _ref4.apm),
                  (aragonId = _ref4.aragonId),
                  (silent = _ref4.silent),
                  (debug = _ref4.debug)
                _context5.next = 3
                return ensureWeb3(network)

              case 3:
                web3 = _context5.sent
                template = kit || template
                templateVersion = kitVersion || templateVersion
                _context5.next = 8
                return exports.task({
                  web3: web3,
                  reporter: reporter,
                  network: network,
                  apmOptions: apmOptions,
                  template: template,
                  templateVersion: templateVersion,
                  fn: fn,
                  fnArgs: fnArgs,
                  deployEvent: deployEvent,
                  skipChecks: false,
                  aragonId: aragonId,
                  silent: silent,
                  debug: debug,
                })

              case 8:
                task = _context5.sent
                return _context5.abrupt(
                  'return',
                  task.run().then(function(ctx) {
                    if (aragonId) {
                      reporter.success(
                        'Created DAO: '
                          .concat(green(ctx.domain), ' at ')
                          .concat(green(ctx.daoAddress))
                      )
                    } else {
                      reporter.success(
                        'Created DAO: '.concat(green(ctx.daoAddress))
                      )
                    }

                    if (kit || kitVersion) {
                      reporter.warning(
                        "The use of kits is deprecated and templates should be used instead. The new options for 'dao new' are '--template' and '--template-version'"
                      )
                    }

                    process.exit()
                  })
                )

              case 10:
              case 'end':
                return _context5.stop()
            }
          }
        }, _callee5)
      })
    )

    return function(_x7) {
      return _ref5.apply(this, arguments)
    }
  })()
// # sourceMappingURL=new.js.map
