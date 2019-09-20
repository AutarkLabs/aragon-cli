'use strict'

require('core-js/modules/es.array.for-each')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.get-own-property-descriptor')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.object.values')

require('core-js/modules/es.promise')

require('core-js/modules/es.string.iterator')

require('core-js/modules/es.weak-map')

require('core-js/modules/web.dom-collections.for-each')

require('core-js/modules/web.dom-collections.iterator')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.resolveEnsDomain = resolveEnsDomain
exports['default'] = void 0

require('regenerator-runtime/runtime')

var _wrapper = _interopRequireWildcard(require('@aragon/wrapper'))

function _getRequireWildcardCache() {
  if (typeof WeakMap !== 'function') return null
  var cache = new WeakMap()
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache
  }
  return cache
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj
  }
  var cache = _getRequireWildcardCache()
  if (cache && cache.has(obj)) {
    return cache.get(obj)
  }
  var newObj = {}
  if (obj != null) {
    var hasPropertyDescriptor =
      Object.defineProperty && Object.getOwnPropertyDescriptor
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor
          ? Object.getOwnPropertyDescriptor(obj, key)
          : null
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc)
        } else {
          newObj[key] = obj[key]
        }
      }
    }
  }
  newObj['default'] = obj
  if (cache) {
    cache.set(obj, newObj)
  }
  return newObj
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

var noop = function noop() {} // Subscribe to wrapper's observables

var subscribe = function subscribe(wrapper, _ref) {
  var onApps = _ref.onApps
  var onForwarders = _ref.onForwarders
  var onTransaction = _ref.onTransaction
  var onPermissions = _ref.onPermissions
  var apps = wrapper.apps
  var forwarders = wrapper.forwarders
  var transactions = wrapper.transactions
  var permissions = wrapper.permissions
  var subscriptions = {
    apps: apps.subscribe(onApps),
    connectedApp: null,
    forwarders: forwarders.subscribe(onForwarders),
    transactions: transactions.subscribe(onTransaction),
    permissions: permissions.subscribe(onPermissions),
  }
  return subscriptions
}

function resolveEnsDomain(_x, _x2) {
  return _resolveEnsDomain.apply(this, arguments)
}

function _resolveEnsDomain() {
  _resolveEnsDomain = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee2(domain, opts) {
      return regeneratorRuntime.wrap(
        function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                _context2.prev = 0
                _context2.next = 3
                return (0, _wrapper.ensResolve)(domain, opts)

              case 3:
                return _context2.abrupt('return', _context2.sent)

              case 6:
                _context2.prev = 6
                _context2.t0 = _context2['catch'](0)

                if (!(_context2.t0.message === 'ENS name not defined.')) {
                  _context2.next = 10
                  break
                }

                return _context2.abrupt('return', '')

              case 10:
                throw _context2.t0

              case 11:
              case 'end':
                return _context2.stop()
            }
          }
        },
        _callee2,
        null,
        [[0, 6]]
      )
    })
  )
  return _resolveEnsDomain.apply(this, arguments)
}

var initWrapper =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee(dao, ensRegistryAddress) {
        var _ref3
        var provider
        var gasPrice
        var _ref3$accounts
        var accounts
        var _ref3$walletProvider
        var walletProvider
        var _ref3$ipfsConf
        var ipfsConf
        var _ref3$onError
        var onError
        var _ref3$onApps
        var onApps
        var _ref3$onForwarders
        var onForwarders
        var _ref3$onTransaction
        var onTransaction
        var _ref3$onDaoAddress
        var onDaoAddress
        var _ref3$onPermissions
        var onPermissions
        var isDomain
        var daoAddress
        var wrapper
        var subscriptions
        var _args = arguments

        return regeneratorRuntime.wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  ;(_ref3 =
                    _args.length > 2 && _args[2] !== undefined ? _args[2] : {}),
                    (provider = _ref3.provider),
                    (gasPrice = _ref3.gasPrice),
                    (_ref3$accounts = _ref3.accounts),
                    (accounts =
                      _ref3$accounts === void 0 ? '' : _ref3$accounts),
                    (_ref3$walletProvider = _ref3.walletProvider),
                    (walletProvider =
                      _ref3$walletProvider === void 0
                        ? null
                        : _ref3$walletProvider),
                    (_ref3$ipfsConf = _ref3.ipfsConf),
                    (ipfsConf =
                      _ref3$ipfsConf === void 0 ? {} : _ref3$ipfsConf),
                    (_ref3$onError = _ref3.onError),
                    (onError = _ref3$onError === void 0 ? noop : _ref3$onError),
                    (_ref3$onApps = _ref3.onApps),
                    (onApps = _ref3$onApps === void 0 ? noop : _ref3$onApps),
                    (_ref3$onForwarders = _ref3.onForwarders),
                    (onForwarders =
                      _ref3$onForwarders === void 0
                        ? noop
                        : _ref3$onForwarders),
                    (_ref3$onTransaction = _ref3.onTransaction),
                    (onTransaction =
                      _ref3$onTransaction === void 0
                        ? noop
                        : _ref3$onTransaction),
                    (_ref3$onDaoAddress = _ref3.onDaoAddress),
                    (onDaoAddress =
                      _ref3$onDaoAddress === void 0
                        ? noop
                        : _ref3$onDaoAddress),
                    (_ref3$onPermissions = _ref3.onPermissions),
                    (onPermissions =
                      _ref3$onPermissions === void 0
                        ? noop
                        : _ref3$onPermissions)

                  isDomain = function isDomain(dao) {
                    return /[a-z0-9]+\.eth/.test(dao)
                  }

                  if (!isDomain(dao)) {
                    _context.next = 8
                    break
                  }

                  _context.next = 5
                  return resolveEnsDomain(dao, {
                    provider: provider,
                    registryAddress: ensRegistryAddress,
                  })

                case 5:
                  _context.t0 = _context.sent
                  _context.next = 9
                  break

                case 8:
                  _context.t0 = dao

                case 9:
                  daoAddress = _context.t0

                  if (daoAddress) {
                    _context.next = 13
                    break
                  }

                  onError(new Error('The provided DAO address is invalid'))
                  return _context.abrupt('return')

                case 13:
                  onDaoAddress(daoAddress) // TODO: don't reinitialize if cached

                  wrapper = new _wrapper['default'](daoAddress, {
                    provider: provider,
                    defaultGasPriceFn: function defaultGasPriceFn() {
                      return gasPrice
                    },
                    apm: {
                      ipfs: ipfsConf,
                      ensRegistryAddress: ensRegistryAddress,
                    },
                  })
                  _context.prev = 15
                  _context.next = 18
                  return wrapper.init({
                    accounts: {
                      providedAccounts: accounts,
                    },
                  })

                case 18:
                  _context.next = 26
                  break

                case 20:
                  _context.prev = 20
                  _context.t1 = _context['catch'](15)

                  if (!(_context.t1.message === 'connection not open')) {
                    _context.next = 25
                    break
                  }

                  onError(
                    new Error(
                      'The wrapper can not be initialized without a connection'
                    )
                  )
                  return _context.abrupt('return')

                case 25:
                  throw _context.t1

                case 26:
                  subscriptions = subscribe(
                    wrapper,
                    {
                      onApps: onApps,
                      onForwarders: onForwarders,
                      onTransaction: onTransaction,
                      onPermissions: onPermissions,
                    },
                    {
                      ipfsConf: ipfsConf,
                    }
                  )

                  wrapper.cancel = function() {
                    Object.values(subscriptions).forEach(function(
                      subscription
                    ) {
                      if (subscription) {
                        subscription.unsubscribe()
                      }
                    })
                  }

                  return _context.abrupt('return', wrapper)

                case 29:
                case 'end':
                  return _context.stop()
              }
            }
          },
          _callee,
          null,
          [[15, 20]]
        )
      })
    )

    return function initWrapper(_x3, _x4) {
      return _ref2.apply(this, arguments)
    }
  })()

var _default = initWrapper
exports['default'] = _default
// # sourceMappingURL=aragonjs-wrapper.js.map
