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

var daoArg = require('../utils/daoArg')

var aclExecHandler = require('./utils/aclExecHandler') // Note: we usually order these values as entity, proxy, role but this order fits
//       better with other CLI commands

exports.command = 'set-manager <dao> <app> <role> <new-manager>'
exports.describe =
  'Set the permission manager for a permission (only the current permission manager can do it)'

exports.builder = function(yargs) {
  return daoArg(yargs)
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee(_ref) {
        var reporter,
          dao,
          app,
          role,
          newManager,
          network,
          wsProvider,
          apm,
          gasPrice,
          method,
          params
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                ;(reporter = _ref.reporter),
                  (dao = _ref.dao),
                  (app = _ref.app),
                  (role = _ref.role),
                  (newManager = _ref.newManager),
                  (network = _ref.network),
                  (wsProvider = _ref.wsProvider),
                  (apm = _ref.apm),
                  (gasPrice = _ref.gasPrice)
                method = 'setPermissionManager'
                params = [newManager, app, role]
                return _context.abrupt(
                  'return',
                  aclExecHandler(dao, method, params, {
                    reporter: reporter,
                    gasPrice: gasPrice,
                    apm: apm,
                    network: network,
                    wsProvider: wsProvider,
                    role: role,
                  })
                )

              case 4:
              case 'end':
                return _context.stop()
            }
          }
        }, _callee)
      })
    )

    return function(_x) {
      return _ref2.apply(this, arguments)
    }
  })()
// # sourceMappingURL=set-manager.js.map