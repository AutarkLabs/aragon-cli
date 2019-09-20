'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/web.timers')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.openClient = openClient

require('regenerator-runtime/runtime')

var _open = _interopRequireDefault(require('open'))

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

function openClient(_x, _x2) {
  return _openClient.apply(this, arguments)
}

function _openClient() {
  _openClient = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee2(ctx, clientPort) {
      var checkClientReady
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch ((_context2.prev = _context2.next)) {
            case 0:
              // Check until the client is served
              checkClientReady = function checkClientReady() {
                setTimeout(
                  /* #__PURE__ */
                  _asyncToGenerator(
                    /* #__PURE__ */
                    regeneratorRuntime.mark(function _callee() {
                      var portTaken
                      return regeneratorRuntime.wrap(function _callee$(
                        _context
                      ) {
                        while (1) {
                          switch ((_context.prev = _context.next)) {
                            case 0:
                              _context.next = 2
                              return (0, _util.isPortTaken)(clientPort)

                            case 2:
                              portTaken = _context.sent

                              if (portTaken) {
                                ;(0, _open['default'])(
                                  'http://localhost:'
                                    .concat(clientPort, '/#/')
                                    .concat(
                                      ctx.daoAddress ? ctx.daoAddress : ''
                                    )
                                )
                              } else {
                                checkClientReady()
                              }

                            case 4:
                            case 'end':
                              return _context.stop()
                          }
                        }
                      },
                      _callee)
                    })
                  ),
                  250
                )
              }

              checkClientReady()

            case 2:
            case 'end':
              return _context2.stop()
          }
        }
      }, _callee2)
    })
  )
  return _openClient.apply(this, arguments)
}
// # sourceMappingURL=open-client.js.map
