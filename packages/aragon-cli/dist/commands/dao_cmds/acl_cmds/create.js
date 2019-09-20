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

exports.command = 'create <dao> <app> <role> <entity> <manager>'
exports.describe =
  "Create a permission in a DAO (only usable for permissions that haven't been set)"

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
          network,
          gasPrice,
          apm,
          dao,
          app,
          role,
          entity,
          manager,
          wsProvider,
          silent,
          debug,
          method,
          params
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                ;(reporter = _ref.reporter),
                  (network = _ref.network),
                  (gasPrice = _ref.gasPrice),
                  (apm = _ref.apm),
                  (dao = _ref.dao),
                  (app = _ref.app),
                  (role = _ref.role),
                  (entity = _ref.entity),
                  (manager = _ref.manager),
                  (wsProvider = _ref.wsProvider),
                  (silent = _ref.silent),
                  (debug = _ref.debug)
                method = 'createPermission'
                params = [entity, app, role, manager]
                return _context.abrupt(
                  'return',
                  aclExecHandler(dao, method, params, {
                    reporter: reporter,
                    gasPrice: gasPrice,
                    apm: apm,
                    network: network,
                    wsProvider: wsProvider,
                    role: role,
                    silent: silent,
                    debug: debug,
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
// # sourceMappingURL=create.js.map