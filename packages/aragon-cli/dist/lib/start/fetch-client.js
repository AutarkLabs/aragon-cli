'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.join')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.fetchClient = fetchClient

require('regenerator-runtime/runtime')

var _path = _interopRequireDefault(require('path'))

var _fsExtra = require('fs-extra')

var _os = _interopRequireDefault(require('os'))

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

function fetchClient(_x, _x2, _x3) {
  return _fetchClient.apply(this, arguments)
}

function _fetchClient() {
  _fetchClient = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee(ctx, task, clientVersion) {
      var CLIENT_PATH, files, BUILD_PATH
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              ctx.clientFetch = true
              ctx.clientAvailable = true
              CLIENT_PATH = ''
                .concat(_os['default'].homedir(), '/.aragon/client-')
                .concat(clientVersion)
              ctx.clientPath = CLIENT_PATH // Make sure we haven't already downloaded the client

              if (
                !(0, _fsExtra.existsSync)(_path['default'].resolve(CLIENT_PATH))
              ) {
                _context.next = 7
                break
              }

              task.skip('Client already fetched')
              return _context.abrupt('return')

            case 7:
              // Get prebuild client from aragen
              files = _path['default'].resolve(
                require.resolve('@aragon/aragen'),
                '../ipfs-cache',
                '@aragon/aragon'
              ) // Ensure folder exists

              BUILD_PATH = _path['default'].join(CLIENT_PATH, 'build')
              ;(0, _fsExtra.ensureDirSync)(BUILD_PATH) // Copy files

              _context.next = 12
              return (0, _fsExtra.copy)(files, BUILD_PATH)

            case 12:
            case 'end':
              return _context.stop()
          }
        }
      }, _callee)
    })
  )
  return _fetchClient.apply(this, arguments)
}
// # sourceMappingURL=fetch-client.js.map
