'use strict'

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.buildClient = buildClient

require('regenerator-runtime/runtime')

var _execa = _interopRequireDefault(require('execa'))

var _util = require('../../util')

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

function buildClient(_x, _x2) {
  return _buildClient.apply(this, arguments)
}

function _buildClient() {
  _buildClient = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee(ctx, clientPath) {
      var bin, startArguments
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              bin = (0, _util.getNodePackageManager)()
              startArguments = {
                cwd: clientPath || ctx.clientPath,
              }
              return _context.abrupt(
                'return',
                (0, _execa['default'])(
                  bin,
                  ['run', 'build:local'],
                  startArguments
                )['catch'](function(err) {
                  throw new Error(err)
                })
              )

            case 3:
            case 'end':
              return _context.stop()
          }
        }
      }, _callee)
    })
  )
  return _buildClient.apply(this, arguments)
}
// # sourceMappingURL=build-client.js.map
