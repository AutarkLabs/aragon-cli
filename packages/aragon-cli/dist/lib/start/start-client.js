'use strict'

require('core-js/modules/es.array.join')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.startClient = startClient

require('regenerator-runtime/runtime')

var _execa = _interopRequireDefault(require('execa'))

var _path = _interopRequireDefault(require('path'))

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

function startClient(_x, _x2, _x3) {
  return _startClient.apply(this, arguments)
}

function _startClient() {
  _startClient = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee(ctx, clientPort, clientPath) {
      var bin, rootPath, startArguments
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2
              return (0, _util.isPortTaken)(clientPort)

            case 2:
              if (!_context.sent) {
                _context.next = 5
                break
              }

              ctx.portOpen = true
              return _context.abrupt('return')

            case 5:
              bin = (0, _util.getBinary)('http-server')
              rootPath = clientPath || ctx.clientPath
              startArguments = {
                cwd: _path['default'].join(rootPath, 'build'),
              } // TODO: Use -o option to open url. Will remove open dependency
              ;(0, _execa['default'])(bin, ['-p', clientPort], startArguments)[
                'catch'
              ](function(err) {
                throw new Error(err)
              })

            case 9:
            case 'end':
              return _context.stop()
          }
        }
      }, _callee)
    })
  )
  return _startClient.apply(this, arguments)
}
// # sourceMappingURL=start-client.js.map
