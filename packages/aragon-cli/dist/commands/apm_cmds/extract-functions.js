'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.symbol.iterator')

require('core-js/modules/es.array.for-each')

require('core-js/modules/es.array.from')

require('core-js/modules/es.array.is-array')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.array.map')

require('core-js/modules/es.date.to-string')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.set')

require('core-js/modules/es.string.iterator')

require('core-js/modules/es.string.replace')

require('core-js/modules/web.dom-collections.for-each')

require('core-js/modules/web.dom-collections.iterator')

require('regenerator-runtime/runtime')

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

var path = require('path')

var _require = require('js-sha3')
var keccak256 = _require.keccak256

var _require2 = require('fs-extra')
var writeJson = _require2.writeJson

var extract = require('../../helpers/solidity-extractor')

var chalk = require('chalk')

exports.command = 'extract-functions [contract]'
exports.describe = 'Extract function information from a Solidity file'

exports.builder = function(yargs) {
  return yargs
    .positional('contract', {
      description: 'Path to the Solidity file to extract functions from',
      type: 'string',
    })
    .option('output', {
      description:
        'Path of the directory where the output file will be saved to',
      type: 'string',
      default: '.',
    })
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee(_ref) {
        var cwd,
          reporter,
          contract,
          output,
          functions,
          roleSet,
          roleIds,
          roles,
          content,
          filename,
          outputPath
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                ;(cwd = _ref.cwd),
                  (reporter = _ref.reporter),
                  (contract = _ref.contract),
                  (output = _ref.output)
                _context.next = 3
                return extract(path.resolve(cwd, contract))

              case 3:
                functions = _context.sent
                roleSet = new Set()
                functions.forEach(function(_ref3) {
                  var roles = _ref3.roles
                  return roles.forEach(function(role) {
                    return roleSet.add(role)
                  })
                })
                roleIds = _toConsumableArray(roleSet)
                roles = roleIds.map(function(id) {
                  return {
                    id: id,
                    bytes: '0x' + keccak256(id),
                    name: '',
                    // Name and params can't be extracted from solidity file, must be filled in manually
                    params: [],
                  }
                })
                content = {
                  roles: roles,
                  functions: functions,
                }
                filename = path.basename(contract).replace('.sol', '.json')
                outputPath = path.resolve(output, filename)
                _context.next = 13
                return writeJson(outputPath, content, {
                  spaces: '\t',
                })

              case 13:
                reporter.success('Saved to '.concat(chalk.blue(outputPath)))

              case 14:
              case 'end':
                return _context.stop()
            }
          }
        }, _callee)
      })
    )

    return function(_x) {
      return _ref2.apply(this, arguments)
    }
  })()
// # sourceMappingURL=extract-functions.js.map
