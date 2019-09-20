'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.symbol.iterator')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.filter')

require('core-js/modules/es.array.from')

require('core-js/modules/es.array.is-array')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.array.join')

require('core-js/modules/es.array.map')

require('core-js/modules/es.array.reduce')

require('core-js/modules/es.date.to-json')

require('core-js/modules/es.date.to-string')

require('core-js/modules/es.function.name')

require('core-js/modules/es.object.assign')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.parse-int')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.iterator')

require('core-js/modules/es.string.replace')

require('core-js/modules/es.string.split')

require('core-js/modules/web.dom-collections.iterator')

require('core-js/modules/web.timers')

require('core-js/modules/web.url.to-json')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.ensureConnection = ensureConnection
exports.connectToAPI = connectToAPI
exports.parseAddressAsURL = parseAddressAsURL
exports.isDaemonRunning = isDaemonRunning
exports.getMerkleDAG = getMerkleDAG
exports.stringifyMerkleDAG = stringifyMerkleDAG
exports.extractCIDsFromMerkleDAG = extractCIDsFromMerkleDAG
exports.propagateFiles = propagateFiles
exports.getDefaultRepoPath = getDefaultRepoPath
exports.getRepoVersion = getRepoVersion
exports.getRepoSize = getRepoSize
exports.getRepoConfig = getRepoConfig
exports.getPortsConfig = getPortsConfig
exports.getPeerIDConfig = getPeerIDConfig

require('regenerator-runtime/runtime')

var _chalk = _interopRequireDefault(require('chalk'))

var _byteSize = _interopRequireDefault(require('byte-size'))

var _stringifyTree = require('stringify-tree')

var _ipfsHttpClient = _interopRequireDefault(require('ipfs-http-client'))

var _nodeFetch = _interopRequireDefault(require('node-fetch'))

var _fsExtra = require('fs-extra')

var _path = require('path')

var _os = require('os')

var _util = require('../../util')

var _getFolderSize = _interopRequireDefault(require('get-folder-size'))

var _url = _interopRequireDefault(require('url'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  )
}

function _nonIterableSpread() {
  throw new TypeError('Invalid attempt to spread non-iterable instance')
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === '[object Arguments]'
  )
    return Array.from(iter)
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i]
    }
    return arr2
  }
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

var FETCH_TIMEOUT = 20000 // 20s

var FETCH_TIMEOUT_ERR = 'Request timed out'

function ensureConnection(_x) {
  return _ensureConnection.apply(this, arguments)
}

function _ensureConnection() {
  _ensureConnection = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee(apiAddress) {
      var client
      return regeneratorRuntime.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                _context.prev = 0
                client = connectToAPI(apiAddress)
                _context.next = 4
                return client.id()

              case 4:
                return _context.abrupt('return', {
                  client: client,
                })

              case 7:
                _context.prev = 7
                _context.t0 = _context['catch'](0)
                throw new Error(
                  'Could not connect to the IPFS API at '.concat(
                    JSON.stringify(apiAddress)
                  )
                )

              case 10:
              case 'end':
                return _context.stop()
            }
          }
        },
        _callee,
        null,
        [[0, 7]]
      )
    })
  )
  return _ensureConnection.apply(this, arguments)
}

function connectToAPI(apiAddress) {
  return (0, _ipfsHttpClient['default'])(apiAddress)
}

function parseAddressAsURL(address) {
  var uri = new _url['default'].URL(address)
  return {
    protocol: uri.protocol.replace(':', ''),
    host: uri.hostname,
    port: parseInt(uri.port),
  }
}
/**
 * Check whether the daemon is running by connecting to the API.
 *
 * @param {URL} apiAddress a `URL` object
 * @returns {boolean} true if it is running
 */

function isDaemonRunning(_x2) {
  return _isDaemonRunning.apply(this, arguments)
}

function _isDaemonRunning() {
  _isDaemonRunning = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee2(apiAddress) {
      var portTaken
      return regeneratorRuntime.wrap(
        function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                _context2.next = 2
                return (0, _util.isPortTaken)(apiAddress.port)

              case 2:
                portTaken = _context2.sent

                if (portTaken) {
                  _context2.next = 5
                  break
                }

                return _context2.abrupt('return', false)

              case 5:
                _context2.prev = 5
                _context2.next = 8
                return ensureConnection(apiAddress)

              case 8:
                return _context2.abrupt('return', true)

              case 11:
                _context2.prev = 11
                _context2.t0 = _context2['catch'](5)
                return _context2.abrupt('return', false)

              case 14:
              case 'end':
                return _context2.stop()
            }
          }
        },
        _callee2,
        null,
        [[5, 11]]
      )
    })
  )
  return _isDaemonRunning.apply(this, arguments)
}

function getMerkleDAG(_x3, _x4) {
  return _getMerkleDAG.apply(this, arguments)
} // object.get returns an object of type DAGNode
// https://github.com/ipld/js-ipld-dag-pb#dagnode-instance-methods-and-properties

function _getMerkleDAG() {
  _getMerkleDAG = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee4(client, cid) {
      var opts
      var merkleDAG
      var promises
      var _args4 = arguments
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch ((_context4.prev = _context4.next)) {
            case 0:
              opts =
                _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {}
              _context4.t0 = parseMerkleDAG
              _context4.next = 4
              return client.object.get(cid)

            case 4:
              _context4.t1 = _context4.sent
              merkleDAG = (0, _context4.t0)(_context4.t1)
              merkleDAG.cid = cid

              if (!(opts.recursive && merkleDAG.isDir && merkleDAG.links)) {
                _context4.next = 10
                break
              }

              // fetch the MerkleDAG of each link recursively
              promises = merkleDAG.links.map(
                /* #__PURE__ */
                (function() {
                  var _ref = _asyncToGenerator(
                    /* #__PURE__ */
                    regeneratorRuntime.mark(function _callee3(link) {
                      var object
                      return regeneratorRuntime.wrap(function _callee3$(
                        _context3
                      ) {
                        while (1) {
                          switch ((_context3.prev = _context3.next)) {
                            case 0:
                              _context3.next = 2
                              return getMerkleDAG(client, link.cid, opts)

                            case 2:
                              object = _context3.sent
                              return _context3.abrupt(
                                'return',
                                Object.assign(link, object)
                              )

                            case 4:
                            case 'end':
                              return _context3.stop()
                          }
                        }
                      },
                      _callee3)
                    })
                  )

                  return function(_x13) {
                    return _ref.apply(this, arguments)
                  }
                })()
              )
              return _context4.abrupt(
                'return',
                Promise.all(promises).then(function(links) {
                  merkleDAG.links = links
                  return merkleDAG
                })
              )

            case 10:
              return _context4.abrupt('return', merkleDAG)

            case 11:
            case 'end':
              return _context4.stop()
          }
        }
      }, _callee4)
    })
  )
  return _getMerkleDAG.apply(this, arguments)
}

function parseMerkleDAG(dagNode) {
  var parsed = dagNode.toJSON() // add relevant data

  parsed.isDir = isDir(parsed.data) // remove irrelevant data

  delete parsed.data

  if (!parsed.isDir) {
    // if it's a big file it will have links to its other chunks
    delete parsed.links
  }

  return parsed
}

function isDir(data) {
  return data.length === 2 && data.toString() === '\b\x01'
}

function stringifyMerkleDAGNode(merkleDAG) {
  // ${merkleDAG.isDir ? '📁' : ''}
  var cid = merkleDAG.cid
  var name = merkleDAG.name || 'root'
  var parsedSize = (0, _byteSize['default'])(merkleDAG.size)
  var size = parsedSize.value + parsedSize.unit

  var delimiter = _chalk['default'].gray(' - ')

  return [name, size, _chalk['default'].gray(cid)].join(delimiter)
}

function stringifyMerkleDAG(merkleDAG) {
  return (0, _stringifyTree.stringifyTree)(
    merkleDAG,
    function(node) {
      return stringifyMerkleDAGNode(node)
    },
    function(node) {
      return node.links
    }
  )
}

function extractCIDsFromMerkleDAG(merkleDAG) {
  var opts =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  var CIDs = []
  CIDs.push(merkleDAG.cid)

  if (opts.recursive && merkleDAG.isDir && merkleDAG.links) {
    merkleDAG.links
      .map(function(merkleDAGOfLink) {
        return extractCIDsFromMerkleDAG(merkleDAGOfLink, opts)
      })
      .map(function(CIDsOfLink) {
        return CIDs.push.apply(CIDs, _toConsumableArray(CIDsOfLink))
      })
  }

  return CIDs
}

function timeout() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(FETCH_TIMEOUT_ERR)
    }, FETCH_TIMEOUT)
  })
}

var gateways = [
  'https://ipfs.io/ipfs',
  'https://ipfs.infura.io/ipfs',
  'https://cloudflare-ipfs.com/ipfs',
  'https://ipfs.eth.aragon.network/ipfs',
  'https://ipfs.jes.xxx/ipfs',
  'https://www.eternum.io/ipfs',
  'https://ipfs.wa.hle.rs/ipfs',
]

function queryCidAtGateway(_x5, _x6) {
  return _queryCidAtGateway.apply(this, arguments)
}

function _queryCidAtGateway() {
  _queryCidAtGateway = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee5(gateway, cid) {
      return regeneratorRuntime.wrap(
        function _callee5$(_context5) {
          while (1) {
            switch ((_context5.prev = _context5.next)) {
              case 0:
                _context5.prev = 0
                _context5.next = 3
                return Promise.race([
                  (0, _nodeFetch['default'])(
                    ''.concat(gateway, '/').concat(cid)
                  ), // Add a timeout because the Fetch API does not implement them
                  timeout(),
                ])

              case 3:
                return _context5.abrupt('return', {
                  success: true,
                  cid: cid,
                  gateway: gateway,
                })

              case 6:
                _context5.prev = 6
                _context5.t0 = _context5['catch'](0)
                return _context5.abrupt('return', {
                  success: false,
                  cid: cid,
                  gateway: gateway,
                  error: _context5.t0,
                })

              case 9:
              case 'end':
                return _context5.stop()
            }
          }
        },
        _callee5,
        null,
        [[0, 6]]
      )
    })
  )
  return _queryCidAtGateway.apply(this, arguments)
}

function propagateFile(_x7, _x8) {
  return _propagateFile.apply(this, arguments)
}

function _propagateFile() {
  _propagateFile = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee6(cid, logger) {
      var results, succeeded, failed, errors
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch ((_context6.prev = _context6.next)) {
            case 0:
              _context6.next = 2
              return Promise.all(
                gateways.map(function(gateway) {
                  return queryCidAtGateway(gateway, cid)
                })
              )

            case 2:
              results = _context6.sent
              succeeded = results.filter(function(status) {
                return status.success
              }).length
              failed = gateways.length - succeeded
              logger(
                'Queried '
                  .concat(cid, ' at ')
                  .concat(succeeded, ' gateways successfully, ')
                  .concat(failed, ' failed.')
              )
              errors = results
                .filter(function(result) {
                  return result.error
                })
                .map(function(result) {
                  return result.error
                })
              return _context6.abrupt('return', {
                succeeded: succeeded,
                failed: failed,
                errors: errors,
              })

            case 8:
            case 'end':
              return _context6.stop()
          }
        }
      }, _callee6)
    })
  )
  return _propagateFile.apply(this, arguments)
}

function propagateFiles(_x9) {
  return _propagateFiles.apply(this, arguments)
}

function _propagateFiles() {
  _propagateFiles = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee7(CIDs) {
      var logger
      var results
      var _args7 = arguments
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch ((_context7.prev = _context7.next)) {
            case 0:
              logger =
                _args7.length > 1 && _args7[1] !== undefined
                  ? _args7[1]
                  : function() {}
              _context7.next = 3
              return Promise.all(
                CIDs.map(function(cid) {
                  return propagateFile(cid, logger)
                })
              )

            case 3:
              results = _context7.sent
              return _context7.abrupt('return', {
                gateways: gateways,
                succeeded: results.reduce(function(prev, current) {
                  return prev + current.succeeded
                }, 0),
                failed: results.reduce(function(prev, current) {
                  return prev + current.failed
                }, 0),
                errors: results.reduce(function(prev, current) {
                  return [].concat(
                    _toConsumableArray(prev),
                    _toConsumableArray(current.errors)
                  )
                }, []),
              })

            case 5:
            case 'end':
              return _context7.stop()
          }
        }
      }, _callee7)
    })
  )
  return _propagateFiles.apply(this, arguments)
}

function getDefaultRepoPath() {
  var homedirPath = (0, _os.homedir)()
  return (0, _path.join)(homedirPath, '.ipfs')
}

function getRepoVersion(_x10) {
  return _getRepoVersion.apply(this, arguments)
}

function _getRepoVersion() {
  _getRepoVersion = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee8(repoLocation) {
      var versionFilePath, version
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch ((_context8.prev = _context8.next)) {
            case 0:
              versionFilePath = (0, _path.join)(repoLocation, 'version')
              _context8.next = 3
              return (0, _fsExtra.readJson)(versionFilePath)

            case 3:
              version = _context8.sent
              return _context8.abrupt('return', version)

            case 5:
            case 'end':
              return _context8.stop()
          }
        }
      }, _callee8)
    })
  )
  return _getRepoVersion.apply(this, arguments)
}

function getRepoSize(_x11) {
  return _getRepoSize.apply(this, arguments)
}

function _getRepoSize() {
  _getRepoSize = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee9(repoLocation) {
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch ((_context9.prev = _context9.next)) {
            case 0:
              return _context9.abrupt(
                'return',
                new Promise(function(resolve, reject) {
                  ;(0,
                  _getFolderSize['default'])(repoLocation, function(err, size) {
                    if (err) {
                      reject(err)
                    } else {
                      var humanReadableSize = (0, _byteSize['default'])(size)
                      resolve(humanReadableSize)
                    }
                  })
                })
              )

            case 1:
            case 'end':
              return _context9.stop()
          }
        }
      }, _callee9)
    })
  )
  return _getRepoSize.apply(this, arguments)
}

function getRepoConfig(_x12) {
  return _getRepoConfig.apply(this, arguments)
}

function _getRepoConfig() {
  _getRepoConfig = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee10(repoLocation) {
      var configFilePath, config
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch ((_context10.prev = _context10.next)) {
            case 0:
              configFilePath = (0, _path.join)(repoLocation, 'config')
              _context10.next = 3
              return (0, _fsExtra.readJson)(configFilePath)

            case 3:
              config = _context10.sent
              return _context10.abrupt('return', config)

            case 5:
            case 'end':
              return _context10.stop()
          }
        }
      }, _callee10)
    })
  )
  return _getRepoConfig.apply(this, arguments)
}

function getPortsConfig(repoConfig) {
  return {
    // default: "/ip4/127.0.0.1/tcp/5001"
    api: repoConfig.Addresses.API.split('/').pop(),
    // default: "/ip4/127.0.0.1/tcp/8080"
    gateway: repoConfig.Addresses.Gateway.split('/').pop(),
    // default: [
    //   "/ip4/0.0.0.0/tcp/4001"
    //   "/ip6/::/tcp/4001"
    // ]
    swarm: repoConfig.Addresses.Swarm[0].split('/').pop(),
  }
}

function getPeerIDConfig(repoConfig) {
  return repoConfig.Identity.PeerID
}
// # sourceMappingURL=index.js.map
