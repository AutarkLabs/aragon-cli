'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.symbol.iterator')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.is-array')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.array.join')

require('core-js/modules/es.object.assign')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.string.iterator')

require('core-js/modules/web.dom-collections.iterator')

require('regenerator-runtime/runtime')

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj
    }
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj
    }
  }
  return _typeof(obj)
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

var findUp = require('find-up')

var path = require('path')

var execa = require('execa')

var net = require('net')

var fs = require('fs')

var _require = require('fs-extra')
var readJson = _require.readJson

var which = require('which')

var cachedProjectRoot
var PGK_MANAGER_BIN_NPM = 'npm'
var debugLogger = process.env.DEBUG ? console.log : function() {}
var ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

var findProjectRoot = function findProjectRoot() {
  if (!cachedProjectRoot) {
    try {
      cachedProjectRoot = path.dirname(findUp.sync('arapp.json'))
    } catch (_) {
      throw new Error('This directory is not an Aragon project') // process.exit(1)
    }
  }

  return cachedProjectRoot
}

var isPortTaken =
  /* #__PURE__ */
  (function() {
    var _ref = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee(port, opts) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                opts = Object.assign(
                  {
                    timeout: 1000,
                  },
                  opts
                )
                return _context.abrupt(
                  'return',
                  new Promise(function(resolve) {
                    var socket = new net.Socket()

                    var onError = function onError() {
                      socket.destroy()
                      resolve(false)
                    }

                    socket.setTimeout(opts.timeout)
                    socket.on('error', onError)
                    socket.on('timeout', onError)
                    socket.connect(port, opts.host, function() {
                      socket.end()
                      resolve(true)
                    })
                  })
                )

              case 2:
              case 'end':
                return _context.stop()
            }
          }
        }, _callee)
      })
    )

    return function isPortTaken(_x, _x2) {
      return _ref.apply(this, arguments)
    }
  })()

var getNodePackageManager = function getNodePackageManager() {
  return PGK_MANAGER_BIN_NPM
}

var installDeps = function installDeps(cwd, task) {
  var bin = getNodePackageManager()
  var installTask = execa(bin, ['install'], {
    cwd: cwd,
  })
  installTask.stdout.on('data', function(log) {
    if (!log) return
    task.output = log
  })
  return installTask['catch'](function(err) {
    throw new Error(
      ''
        .concat(err.message, '\n')
        .concat(
          err.stderr,
          '\n\nFailed to install dependencies. See above output.'
        )
    )
  })
}
/**
 * Attempts to find the binary path locally and then globally.
 *
 * @param {string} binaryName e.g.: `ipfs`
 * @returns {string} the path to the binary, `null` if unsuccessful
 */

var getBinary = function getBinary(binaryName) {
  var binaryPath = getLocalBinary(binaryName)

  if (binaryPath === null) {
    binaryPath = getGlobalBinary(binaryName)
  }

  if (binaryPath === null) {
    debugLogger('Cannot find binary '.concat(binaryName, '.'))
  } else {
    debugLogger(
      'Found binary '.concat(binaryName, ' at ').concat(binaryPath, '.')
    )
  }

  return binaryPath
}

var getLocalBinary = function getLocalBinary(binaryName, projectRoot) {
  if (!projectRoot) {
    // __dirname evaluates to the directory of this file (util.js)
    // e.g.: `../dist/` or `../src/`
    projectRoot = path.join(__dirname, '..')
  } // check local node_modules

  var binaryPath = path.join(projectRoot, 'node_modules', '.bin', binaryName)
  debugLogger('Searching binary '.concat(binaryName, ' at ').concat(binaryPath))

  if (fs.existsSync(binaryPath)) {
    return binaryPath
  } // check parent node_modules

  binaryPath = path.join(projectRoot, '..', '.bin', binaryName)
  debugLogger(
    'Searching binary '.concat(binaryName, ' at ').concat(binaryPath, '.')
  )

  if (fs.existsSync(binaryPath)) {
    return binaryPath
  } // check parent node_modules if this module is scoped (e.g.: @scope/package)

  binaryPath = path.join(projectRoot, '..', '..', '.bin', binaryName)
  debugLogger(
    'Searching binary '.concat(binaryName, ' at ').concat(binaryPath, '.')
  )

  if (fs.existsSync(binaryPath)) {
    return binaryPath
  }

  return null
}

var getGlobalBinary = function getGlobalBinary(binaryName) {
  debugLogger(
    'Searching binary '.concat(binaryName, ' in the global PATH variable.')
  )

  try {
    return which.sync(binaryName)
  } catch (_unused) {
    return null
  }
} // TODO: Add a cwd paramter

var runScriptTask =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee2(task, scriptName) {
        var packageJson, scripts, bin, scriptTask
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                if (fs.existsSync('package.json')) {
                  _context2.next = 3
                  break
                }

                task.skip('No package.json found')
                return _context2.abrupt('return')

              case 3:
                _context2.next = 5
                return readJson('package.json')

              case 5:
                packageJson = _context2.sent
                scripts = packageJson.scripts || {}

                if (scripts[scriptName]) {
                  _context2.next = 10
                  break
                }

                task.skip('Build script not defined in package.json')
                return _context2.abrupt('return')

              case 10:
                bin = getNodePackageManager()
                scriptTask = execa(bin, ['run', scriptName])
                scriptTask.stdout.on('data', function(log) {
                  if (!log) return
                  task.output = 'npm run '.concat(scriptName, ': ').concat(log)
                })
                return _context2.abrupt(
                  'return',
                  scriptTask['catch'](function(err) {
                    throw new Error(
                      ''
                        .concat(err.message, '\n')
                        .concat(
                          err.stderr,
                          '\n\nFailed to build. See above output.'
                        )
                    )
                  })
                )

              case 14:
              case 'end':
                return _context2.stop()
            }
          }
        }, _callee2)
      })
    )

    return function runScriptTask(_x3, _x4) {
      return _ref2.apply(this, arguments)
    }
  })()

var getContract = function getContract(pkg, contract) {
  var artifact = require(''
    .concat(pkg, '/build/contracts/')
    .concat(contract, '.json'))

  return artifact
}

var ANY_ENTITY = '0xffffffffffffffffffffffffffffffffffffffff'
var NO_MANAGER = '0x0000000000000000000000000000000000000000'
var DEFAULT_GAS_FUZZ_FACTOR = 1.5
var LAST_BLOCK_GAS_LIMIT_FACTOR = 0.95
/**
 *
 * Calculate the recommended gas limit
 *
 * @param {*} web3 eth provider to get the last block gas limit
 * @param {number} estimatedGas estimated gas
 * @param {number} gasFuzzFactor defaults to 1.5
 * @returns {number} gasLimit
 */

var getRecommendedGasLimit =
  /* #__PURE__ */
  (function() {
    var _ref3 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee3(web3, estimatedGas) {
        var gasFuzzFactor
        var latestBlock
        var blockGasLimit
        var upperGasLimit
        var bufferedGasLimit
        var _args3 = arguments
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                gasFuzzFactor =
                  _args3.length > 2 && _args3[2] !== undefined
                    ? _args3[2]
                    : DEFAULT_GAS_FUZZ_FACTOR
                _context3.next = 3
                return web3.eth.getBlock('latest')

              case 3:
                latestBlock = _context3.sent
                blockGasLimit = latestBlock.gasLimit
                upperGasLimit = Math.round(
                  blockGasLimit * LAST_BLOCK_GAS_LIMIT_FACTOR
                )

                if (!(estimatedGas > upperGasLimit)) {
                  _context3.next = 8
                  break
                }

                return _context3.abrupt('return', estimatedGas)

              case 8:
                // TODO print a warning?
                bufferedGasLimit = Math.round(estimatedGas * gasFuzzFactor)

                if (!(bufferedGasLimit < upperGasLimit)) {
                  _context3.next = 11
                  break
                }

                return _context3.abrupt('return', bufferedGasLimit)

              case 11:
                return _context3.abrupt('return', upperGasLimit)

              case 12:
              case 'end':
                return _context3.stop()
            }
          }
        }, _callee3)
      })
    )

    return function getRecommendedGasLimit(_x5, _x6) {
      return _ref3.apply(this, arguments)
    }
  })()
/**
 * Parse a String to Boolean, or throw an error.
 *
 * The check is **case insensitive**! (Passing `"TRue"` will return `true`)
 *
 * @param {string} target must be a string
 * @returns {boolean} the parsed value
 */

var parseAsBoolean = function parseAsBoolean(target) {
  if (typeof target !== 'string') {
    throw new Error(
      'Expected '
        .concat(target, ' to be of type string, not ')
        .concat(_typeof(target))
    )
  }

  var lowercase = target.toLowerCase()

  if (lowercase === 'true') {
    return true
  }

  if (lowercase === 'false') {
    return false
  }

  throw new Error('Cannot parse '.concat(target, ' as boolean'))
}
/**
 * Parse a String to Array, or throw an error.
 *
 * @param {string} target must be a string
 * @returns {Array} the parsed value
 */

var parseAsArray = function parseAsArray(target) {
  if (typeof target !== 'string') {
    throw new Error(
      'Expected '
        .concat(target, ' to be of type string, not ')
        .concat(_typeof(target))
    )
  } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse

  var json = JSON.parse(target)

  if (Array.isArray(json)) {
    return json
  }

  throw new Error('Cannot parse '.concat(target, ' as array'))
}
/**
 * Parse a String to Boolean or Array, or throw an error.
 *
 * @param {string} target must be a string
 * @returns {boolean|Array} the parsed value
 */

var parseArgumentStringIfPossible = function parseArgumentStringIfPossible(
  target
) {
  // convert to boolean: 'false' to false
  try {
    return parseAsBoolean(target)
  } catch (e) {} // convert to array: '["hello", 1, "true"]' to ["hello", 1, "true"]
  // TODO convert children as well ??

  try {
    return parseAsArray(target)
  } catch (e) {} // nothing to parse

  return target
}
/**
 * Validates an Aragon Id
 * @param {string} aragonId Aragon Id
 * @returns {boolean} `true` if valid
 */

function isValidAragonId(aragonId) {
  return /^[a-z0-9-]+$/.test(aragonId)
}

module.exports = {
  parseArgumentStringIfPossible: parseArgumentStringIfPossible,
  debugLogger: debugLogger,
  findProjectRoot: findProjectRoot,
  isPortTaken: isPortTaken,
  installDeps: installDeps,
  runScriptTask: runScriptTask,
  getNodePackageManager: getNodePackageManager,
  getBinary: getBinary,
  getLocalBinary: getLocalBinary,
  getGlobalBinary: getGlobalBinary,
  getContract: getContract,
  isValidAragonId: isValidAragonId,
  ANY_ENTITY: ANY_ENTITY,
  NO_MANAGER: NO_MANAGER,
  ZERO_ADDRESS: ZERO_ADDRESS,
  getRecommendedGasLimit: getRecommendedGasLimit,
}
// # sourceMappingURL=util.js.map
