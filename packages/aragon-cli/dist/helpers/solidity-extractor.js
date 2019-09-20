'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.symbol.iterator')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.filter')

require('core-js/modules/es.array.is-array')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.array.join')

require('core-js/modules/es.array.map')

require('core-js/modules/es.array.some')

require('core-js/modules/es.date.to-string')

require('core-js/modules/es.object.keys')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.iterator')

require('core-js/modules/es.string.match')

require('core-js/modules/es.string.replace')

require('core-js/modules/es.string.split')

require('core-js/modules/es.string.starts-with')

require('core-js/modules/web.dom-collections.iterator')

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

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  )
}

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance')
}

function _iterableToArrayLimit(arr, i) {
  if (
    !(
      Symbol.iterator in Object(arr) ||
      Object.prototype.toString.call(arr) === '[object Arguments]'
    )
  ) {
    return
  }
  var _arr = []
  var _n = true
  var _d = false
  var _e = undefined
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value)
      if (i && _arr.length === i) break
    }
  } catch (err) {
    _d = true
    _e = err
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']()
    } finally {
      if (_d) throw _e
    }
  }
  return _arr
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr
}

var fs = require('fs')

var _require = require('util')
var promisify = _require.promisify

var readFile = promisify(fs.readFile) // See https://solidity.readthedocs.io/en/v0.4.24/abi-spec.html#types

var SOLIDITY_SHORTHAND_TYPES_MAP = {
  address: 'address',
  bytes: 'bytes',
  uint: 'uint256',
  int: 'int256',
  ufixed: 'ufixed128x18',
  fixed: 'fixed128x18',
  bool: 'bool',
  string: 'string',
}
var SOLIDITY_BASIC_TYPES = Object.keys(SOLIDITY_SHORTHAND_TYPES_MAP)

var modifiesStateAndIsPublic = function modifiesStateAndIsPublic(declaration) {
  return !declaration.match(/\b(internal|private|view|pure|constant)\b/)
} // Check if the type starts with any of the basic types, otherwise it is probably
// a typed contract, so we need to return address for the signature

var typeOrAddress = function typeOrAddress(type) {
  return SOLIDITY_BASIC_TYPES.some(function(t) {
    return type.startsWith(t)
  })
    ? type
    : 'address'
} // Expand shorthands into their full types for calculating function signatures

var expandTypeForSignature = function expandTypeForSignature(type) {
  return SOLIDITY_SHORTHAND_TYPES_MAP[type] || type
} // extracts function signature from function declaration

var getSignature = function getSignature(declaration) {
  var _declaration$match$1$ = declaration
    .match(/^\s*function ([^]*?)\)/m)[1]
    .split('(')
  var _declaration$match$1$2 = _slicedToArray(_declaration$match$1$, 2)
  var name = _declaration$match$1$2[0]
  var params = _declaration$match$1$2[1]

  if (!name) {
    return 'fallback'
  }

  if (params) {
    // Has parameters
    params = params
      .replace(/\n/gm, '')
      .replace(/\t/gm, '')
      .split(',')
      .map(function(param) {
        return param.split(' ').filter(function(s) {
          return s.length > 0
        })[0]
      })
      .map(function(type) {
        return typeOrAddress(type)
      })
      .map(function(type) {
        return expandTypeForSignature(type)
      })
      .join(',')
  }

  return ''.concat(name, '(').concat(params, ')')
}

var getNotice = function getNotice(declaration) {
  // capture from @notice to either next '* @' or end of comment '*/'
  var notices = declaration.match(/(@notice)([^]*?)(\* @|\*\/)/m)
  if (!notices || notices.length === 0) return null
  return notices[0]
    .replace('*/', '')
    .replace('* @', '')
    .replace('@notice ', '')
    .replace(/\n/gm, '')
    .replace(/\t/gm, '')
    .split(' ')
    .filter(function(x) {
      return x.length > 0
    })
    .join(' ')
} // extracts required role from function declaration

var getRoles = function getRoles(declaration) {
  var auths = declaration.match(/auth.?\(([^]*?)\)/gm)
  if (!auths) return []
  return auths.map(function(authStatement) {
    return authStatement
      .split('(')[1]
      .split(',')[0]
      .split(')')[0]
  })
} // Takes the path to a solidity file and extracts public function signatures,
// its auth role if any and its notice statement

module.exports =
  /* #__PURE__ */
  (function() {
    var _ref = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee(sourceCodePath) {
        var sourceCode, funcDecs
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                _context.next = 2
                return readFile(sourceCodePath, 'utf8')

              case 2:
                sourceCode = _context.sent
                funcDecs = sourceCode.match(
                  /(@notice|^\s*function)(?:[^]*?){/gm
                )

                if (funcDecs) {
                  _context.next = 6
                  break
                }

                return _context.abrupt('return', [])

              case 6:
                return _context.abrupt(
                  'return',
                  funcDecs
                    .filter(function(dec) {
                      return modifiesStateAndIsPublic(dec)
                    })
                    .map(function(dec) {
                      return {
                        sig: getSignature(dec),
                        roles: getRoles(dec),
                        notice: getNotice(dec),
                      }
                    })
                )

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
// # sourceMappingURL=solidity-extractor.js.map
