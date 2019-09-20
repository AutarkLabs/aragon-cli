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

var flatten = require('truffle-flattener')

var _require = require('./truffle-config')
var getTruffleConfig = _require.getTruffleConfig

module.exports =
  /* #__PURE__ */
  (function() {
    var _ref = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee(contractArtifacts) {
        var contractName,
          sourcePath,
          compiledAt,
          compiler,
          solcConfig,
          flattenedCode
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                ;(contractName = contractArtifacts.contractName),
                  (sourcePath = contractArtifacts.sourcePath),
                  (compiledAt = contractArtifacts.updatedAt),
                  (compiler = contractArtifacts.compiler)
                solcConfig = getTruffleConfig().solc
                compiler.optimizer = solcConfig
                  ? solcConfig.optimizer
                  : {
                      enabled: false,
                    }
                _context.next = 5
                return flatten([sourcePath])

              case 5:
                flattenedCode = _context.sent
                return _context.abrupt('return', {
                  contractName: contractName,
                  compiledAt: compiledAt,
                  compiler: compiler,
                  flattenedCode: flattenedCode,
                })

              case 7:
              case 'end':
                return _context.stop()
            }
          }
        }, _callee)
      })
    )

    return function(_x) {
      return _ref.apply(this, arguments)
    }
  })()
// # sourceMappingURL=truffle-deploy-artifacts.js.map