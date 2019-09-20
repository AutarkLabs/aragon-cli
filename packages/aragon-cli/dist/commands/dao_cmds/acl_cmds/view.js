'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.filter')

require('core-js/modules/es.array.for-each')

require('core-js/modules/es.array.map')

require('core-js/modules/es.array.reduce')

require('core-js/modules/es.array.slice')

require('core-js/modules/es.date.to-string')

require('core-js/modules/es.object.define-properties')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.get-own-property-descriptor')

require('core-js/modules/es.object.get-own-property-descriptors')

require('core-js/modules/es.object.keys')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.split')

require('core-js/modules/web.dom-collections.for-each')

require('regenerator-runtime/runtime')

var _aragonjsWrapper = _interopRequireDefault(
  require('../utils/aragonjs-wrapper')
)

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

var TaskList = require('listr')

var daoArg = require('../utils/daoArg')

var _require = require('../utils/knownApps')
var listApps = _require.listApps

var _require2 = require('./utils/knownRoles')
var rolesForApps = _require2.rolesForApps

var _require3 = require('../../../helpers/web3-fallback')
var ensureWeb3 = _require3.ensureWeb3

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

var Table = require('cli-table')

var knownRoles = rolesForApps()
var ANY_ENTITY = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF'
var ANY_ENTITY_TEXT = 'Any entity'

var _require4 = require('../../../util')
var NO_MANAGER = _require4.NO_MANAGER
var ZERO_ADDRESS = _require4.ZERO_ADDRESS

var NO_MANAGER_TEXT = 'No Manager'
var knownApps
exports.command = 'view <dao>'
exports.describe = 'Inspect permissions in a DAO'

exports.builder = function(yargs) {
  return daoArg(yargs)
}

var printAppName = function printAppName(appId, addr) {
  if (addr === ANY_ENTITY) return ANY_ENTITY_TEXT
  if (addr === NO_MANAGER) return NO_MANAGER_TEXT
  return knownApps[appId]
    ? ''
        .concat(knownApps[appId].split('.')[0], ' (')
        .concat(addr.slice(0, 6), ')')
    : addr.slice(0, 16) + '...'
}

var appFromProxyAddress = function appFromProxyAddress(proxyAddress, apps) {
  return (
    apps.filter(function(app) {
      return app.proxyAddress === proxyAddress
    })[0] || {}
  )
}

var formatRow = function formatRow(_ref, apps) {
  var to = _ref.to
  var role = _ref.role
  var allowedEntities = _ref.allowedEntities
  var manager = _ref.manager

  if (
    manager === ZERO_ADDRESS ||
    !allowedEntities ||
    allowedEntities.length === 0
  ) {
    return null
  }

  var formattedTo = printAppName(appFromProxyAddress(to, apps).appId, to)
  var formattedRole =
    knownRoles[role] || ''.concat(role.slice(0, 8), '..').concat(role.slice(-6))
  if (formattedRole['id']) formattedRole = formattedRole['id']
  var formattedAllowed = allowedEntities
    .reduce(function(acc, addr) {
      var allowedName = printAppName(
        appFromProxyAddress(addr, apps).appId,
        addr
      )
      var allowedEmoji = allowedName === ANY_ENTITY_TEXT ? '🆓' : '✅'
      return acc + '\n' + allowedEmoji + '  ' + allowedName
    }, '')
    .slice(1) // remove first newline

  var formattedManager = (function() {
    var managerName = printAppName(
      appFromProxyAddress(manager, apps).appId,
      manager
    )
    var managerEmoji = managerName === NO_MANAGER_TEXT ? '🆓' : ''
    return managerEmoji + '  ' + managerName
  })()

  return [formattedTo, formattedRole, formattedAllowed, formattedManager]
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref3 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee(_ref2) {
        var reporter,
          dao,
          network,
          apm,
          wsProvider,
          module,
          silent,
          debug,
          web3,
          tasks
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                ;(reporter = _ref2.reporter),
                  (dao = _ref2.dao),
                  (network = _ref2.network),
                  (apm = _ref2.apm),
                  (wsProvider = _ref2.wsProvider),
                  (module = _ref2.module),
                  (silent = _ref2.silent),
                  (debug = _ref2.debug)
                knownApps = listApps(module ? [module.appName] : [])
                _context.next = 4
                return ensureWeb3(network)

              case 4:
                web3 = _context.sent
                tasks = new TaskList(
                  [
                    {
                      title: 'Inspecting DAO Permissions',
                      task: function task(ctx, _task) {
                        _task.output = 'Fetching permissions for '.concat(
                          dao,
                          '...'
                        )
                        return new Promise(function(resolve, reject) {
                          var resolveIfReady = function resolveIfReady() {
                            if (ctx.acl && ctx.apps) {
                              resolve()
                            }
                          }

                          ;(0, _aragonjsWrapper['default'])(
                            dao,
                            apm['ens-registry'],
                            {
                              provider: wsProvider || web3.currentProvider,
                              onPermissions: function onPermissions(
                                permissions
                              ) {
                                ctx.acl = permissions
                                resolveIfReady()
                              },
                              onApps: function onApps(apps) {
                                ctx.apps = apps
                                resolveIfReady()
                              },
                              onDaoAddress: function onDaoAddress(addr) {
                                ctx.daoAddress = addr
                              },
                              onError: function onError(err) {
                                return reject(err)
                              },
                            }
                          )['catch'](function(err) {
                            reporter.error('Error inspecting DAO')
                            reporter.debug(err)
                            process.exit(1)
                          })
                        })
                      },
                    },
                  ],
                  listrOpts(silent, debug)
                )
                return _context.abrupt(
                  'return',
                  tasks.run().then(function(ctx) {
                    reporter.success(
                      'Successfully fetched DAO apps for '.concat(
                        chalk.green(ctx.daoAddress)
                      )
                    )
                    var acl = ctx.acl // filter according to cli params will happen here

                    var table = new Table({
                      head: [
                        'App',
                        'Action',
                        'Allowed entities',
                        'Manager',
                      ].map(function(x) {
                        return chalk.white(x)
                      }),
                    })
                    var tos = Object.keys(acl)
                    var flattenedACL = tos.reduce(function(acc, to) {
                      var roles = Object.keys(acl[to])
                      var permissions = roles.map(function(role) {
                        return _objectSpread(
                          {
                            to: to,
                            role: role,
                          },
                          acl[to][role]
                        )
                      })
                      return acc.concat(permissions)
                    }, [])
                    flattenedACL
                      .map(function(row) {
                        return formatRow(row, ctx.apps)
                      })
                      .filter(function(row) {
                        return row
                      })
                      .forEach(function(row) {
                        return table.push(row)
                      })
                    console.log(table.toString())
                    process.exit() // force exit, as aragonjs hangs
                  })
                )

              case 7:
              case 'end':
                return _context.stop()
            }
          }
        }, _callee)
      })
    )

    return function(_x) {
      return _ref3.apply(this, arguments)
    }
  })()
// # sourceMappingURL=view.js.map
