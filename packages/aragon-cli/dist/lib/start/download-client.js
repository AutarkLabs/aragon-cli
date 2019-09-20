'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.downloadClient = downloadClient

require('regenerator-runtime/runtime')

var _path = _interopRequireDefault(require('path'))

var _fsExtra = require('fs-extra')

var _os = _interopRequireDefault(require('os'))

var _util = require('util')

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

var clone = (0, _util.promisify)(require('git-clone'))

var pkg = require('../../../package.json')

function downloadClient(_x) {
  return _downloadClient.apply(this, arguments)
}

function _downloadClient() {
  _downloadClient = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee(_ref) {
      var ctx, task, _ref$clientRepo, clientRepo, clientVersion, CLIENT_PATH

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              ;(ctx = _ref.ctx),
                (task = _ref.task),
                (_ref$clientRepo = _ref.clientRepo),
                (clientRepo =
                  _ref$clientRepo === void 0
                    ? pkg.aragon.clientRepo
                    : _ref$clientRepo),
                (clientVersion = _ref.clientVersion)
              CLIENT_PATH = ''
                .concat(_os['default'].homedir(), '/.aragon/client-')
                .concat(clientVersion)
              ctx.clientPath = CLIENT_PATH // Make sure we haven't already downloaded the Client

              if (
                !(0, _fsExtra.existsSync)(_path['default'].resolve(CLIENT_PATH))
              ) {
                _context.next = 7
                break
              }

              task.skip('Client already downloaded')
              ctx.clientAvailable = true
              return _context.abrupt('return')

            case 7:
              // Ensure folder exists
              ;(0, _fsExtra.ensureDirSync)(CLIENT_PATH) // Clone client

              return _context.abrupt(
                'return',
                clone(clientRepo, CLIENT_PATH, {
                  checkout: clientVersion,
                })
              )

            case 9:
            case 'end':
              return _context.stop()
          }
        }
      }, _callee)
    })
  )
  return _downloadClient.apply(this, arguments)
}
// # sourceMappingURL=download-client.js.map
