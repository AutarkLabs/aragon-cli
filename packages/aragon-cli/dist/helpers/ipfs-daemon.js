'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.includes')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.array.join')

require('core-js/modules/es.array.map')

require('core-js/modules/es.date.to-string')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.includes')

require('core-js/modules/es.string.iterator')

require('core-js/modules/es.string.split')

require('core-js/modules/web.dom-collections.iterator')

require('core-js/modules/web.timers')

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

var execa = require('execa')

var fs = require('fs')

var path = require('path')

var os = require('os')

var ipfsAPI = require('ipfs-api')

var _require = require('../util')
var getBinary = _require.getBinary
var isPortTaken = _require.isPortTaken

var ipfsBin = getBinary('ipfs')

var ensureIPFSInitialized =
  /* #__PURE__ */
  (function() {
    var _ref = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                if (ipfsBin) {
                  _context.next = 2
                  break
                }

                throw new Error(
                  'IPFS is not installed. Use `aragon ipfs install` before proceeding.'
                )

              case 2:
                if (fs.existsSync(path.join(os.homedir(), '.ipfs'))) {
                  _context.next = 5
                  break
                }

                _context.next = 5
                return execa(ipfsBin, ['init'])

              case 5:
              case 'end':
                return _context.stop()
            }
          }
        }, _callee)
      })
    )

    return function ensureIPFSInitialized() {
      return _ref.apply(this, arguments)
    }
  })()

var startIPFSDaemon = function startIPFSDaemon() {
  if (!ipfsBin) {
    throw new Error(
      'IPFS is not installed. Use `aragon ipfs install` before proceeding.'
    )
  }

  var IPFS_START_TIMEOUT = 20000 // 20s for timeout, may need to be tweaked

  var startOutput = '' // We add a timeout as starting

  var timeout = new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('Starting IPFS timed out:\n'.concat(startOutput)))
    }, IPFS_START_TIMEOUT)
  })
  var start = new Promise(
    /* #__PURE__ */
    (function() {
      var _ref2 = _asyncToGenerator(
        /* #__PURE__ */
        regeneratorRuntime.mark(function _callee2(resolve, reject) {
          var ipfsProc
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch ((_context2.prev = _context2.next)) {
                case 0:
                  _context2.next = 2
                  return ensureIPFSInitialized()

                case 2:
                  ipfsProc = execa(ipfsBin, ['daemon', '--migrate'])
                  ipfsProc.stdout.on('data', function(data) {
                    startOutput = ''
                      .concat(startOutput)
                      .concat(data.toString(), '\n')
                    if (data.toString().includes('Daemon is ready')) resolve()
                  })
                  ipfsProc.stderr.on('data', function(data) {
                    reject(
                      new Error(
                        'Starting IPFS failed: '.concat(data.toString())
                      )
                    )
                  })

                case 5:
                case 'end':
                  return _context2.stop()
              }
            }
          }, _callee2)
        })
      )

      return function(_x, _x2) {
        return _ref2.apply(this, arguments)
      }
    })()
  )
  return Promise.race([start, timeout])
}

var ipfsNode
var IPFSCORS = [
  {
    key: 'API.HTTPHeaders.Access-Control-Allow-Origin',
    value: ['*'],
  },
  {
    key: 'API.HTTPHeaders.Access-Control-Allow-Methods',
    value: ['PUT', 'GET', 'POST'],
  },
]

var isIPFSCORS =
  /* #__PURE__ */
  (function() {
    var _ref3 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee3(ipfsRpc) {
        var conf, allowOrigin, allowMethods
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                if (!ipfsNode) ipfsNode = ipfsAPI(ipfsRpc)
                _context3.next = 3
                return ipfsNode.config.get('API.HTTPHeaders')

              case 3:
                conf = _context3.sent
                allowOrigin = IPFSCORS[0].key.split('.').pop()
                allowMethods = IPFSCORS[1].key.split('.').pop()

                if (!(conf && conf[allowOrigin] && conf[allowMethods])) {
                  _context3.next = 10
                  break
                }

                return _context3.abrupt('return', true)

              case 10:
                throw new Error(
                  'Please set the following flags in your IPFS node:\n    '.concat(
                    IPFSCORS.map(function(_ref4) {
                      var key = _ref4.key
                      var value = _ref4.value
                      return ''.concat(key, ': ').concat(value)
                    }).join('\n    ')
                  )
                )

              case 11:
              case 'end':
                return _context3.stop()
            }
          }
        }, _callee3)
      })
    )

    return function isIPFSCORS(_x3) {
      return _ref3.apply(this, arguments)
    }
  })()

var setIPFSCORS = function setIPFSCORS(ipfsRpc) {
  if (!ipfsNode) ipfsNode = ipfsAPI(ipfsRpc)
  return Promise.all(
    IPFSCORS.map(function(_ref5) {
      var key = _ref5.key
      var value = _ref5.value
      return ipfsNode.config.set(key, value)
    })
  )
}

var isIPFSRunning =
  /* #__PURE__ */
  (function() {
    var _ref6 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee4(ipfsRpc) {
        var portTaken
        return regeneratorRuntime.wrap(
          function _callee4$(_context4) {
            while (1) {
              switch ((_context4.prev = _context4.next)) {
                case 0:
                  _context4.next = 2
                  return isPortTaken(ipfsRpc.port)

                case 2:
                  portTaken = _context4.sent

                  if (!portTaken) {
                    _context4.next = 14
                    break
                  }

                  if (!ipfsNode) ipfsNode = ipfsAPI(ipfsRpc)
                  _context4.prev = 5
                  _context4.next = 8
                  return ipfsNode.id()

                case 8:
                  return _context4.abrupt('return', true)

                case 11:
                  _context4.prev = 11
                  _context4.t0 = _context4['catch'](5)
                  return _context4.abrupt('return', false)

                case 14:
                  return _context4.abrupt('return', false)

                case 15:
                case 'end':
                  return _context4.stop()
              }
            }
          },
          _callee4,
          null,
          [[5, 11]]
        )
      })
    )

    return function isIPFSRunning(_x4) {
      return _ref6.apply(this, arguments)
    }
  })()

module.exports = {
  startIPFSDaemon: startIPFSDaemon,
  isIPFSCORS: isIPFSCORS,
  setIPFSCORS: setIPFSCORS,
  isIPFSRunning: isIPFSRunning,
}
// # sourceMappingURL=ipfs-daemon.js.map
