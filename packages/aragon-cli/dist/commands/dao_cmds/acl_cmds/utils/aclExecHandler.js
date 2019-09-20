'use strict'

require('core-js/modules/es.array.map')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.string.starts-with')

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

var execHandler = require('../../utils/execHandler').handler

var _require = require('js-sha3')
var keccak256 = _require.keccak256

module.exports =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee2(dao, method, params, _ref) {
        var reporter,
          apm,
          network,
          gasPrice,
          wsProvider,
          role,
          silent,
          debug,
          getTransactionPath
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                ;(reporter = _ref.reporter),
                  (apm = _ref.apm),
                  (network = _ref.network),
                  (gasPrice = _ref.gasPrice),
                  (wsProvider = _ref.wsProvider),
                  (role = _ref.role),
                  (silent = _ref.silent),
                  (debug = _ref.debug)

                getTransactionPath =
                  /* #__PURE__ */
                  (function() {
                    var _ref3 = _asyncToGenerator(
                      /* #__PURE__ */
                      regeneratorRuntime.mark(function _callee(wrapper) {
                        var processedParams
                        return regeneratorRuntime.wrap(function _callee$(
                          _context
                        ) {
                          while (1) {
                            switch ((_context.prev = _context.next)) {
                              case 0:
                                // If the provided role is its name, the name is hashed
                                // TODO: Get role bytes from app artifacts
                                if (role.startsWith('0x')) {
                                  processedParams = params
                                } else {
                                  processedParams = params.map(function(param) {
                                    return param === role
                                      ? '0x' + keccak256(role)
                                      : param
                                  })
                                }

                                return _context.abrupt(
                                  'return',
                                  wrapper.getACLTransactionPath(
                                    method,
                                    processedParams
                                  )
                                )

                              case 2:
                              case 'end':
                                return _context.stop()
                            }
                          }
                        },
                        _callee)
                      })
                    )

                    return function getTransactionPath(_x5) {
                      return _ref3.apply(this, arguments)
                    }
                  })()

                return _context2.abrupt(
                  'return',
                  execHandler(dao, getTransactionPath, {
                    ipfsCheck: false,
                    reporter: reporter,
                    gasPrice: gasPrice,
                    apm: apm,
                    wsProvider: wsProvider,
                    network: network,
                    silent: silent,
                    debug: debug,
                  })
                )

              case 3:
              case 'end':
                return _context2.stop()
            }
          }
        }, _callee2)
      })
    )

    return function(_x, _x2, _x3, _x4) {
      return _ref2.apply(this, arguments)
    }
  })()
// # sourceMappingURL=aclExecHandler.js.map
