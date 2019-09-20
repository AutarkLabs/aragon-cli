'use strict'

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

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

var devnull = require('dev-null')

var _require = require('../util')
var getBinary = _require.getBinary

var truffleBin = getBinary('truffle')

var runTruffle = function runTruffle(args, _ref) {
  var stdout = _ref.stdout
  var stderr = _ref.stderr
  var stdin = _ref.stdin
  return new Promise(function(resolve, reject) {
    var truffle = execa(truffleBin, args)
    var errMsg = ''
    truffle.on('exit', function(code) {
      code === 0 ? resolve() : reject(errMsg)
    }) // errMsg is only used if the process fails

    truffle.stdout.on('data', function(err) {
      errMsg += err
    })
    truffle.stdout.pipe(stdout || process.stdout)
    truffle.stderr.pipe(stderr || process.stderr)
    process.stdin.pipe(stdin || truffle.stdin)
  })
}

var compileContracts =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  _context.prev = 0
                  _context.next = 3
                  return runTruffle(['compile'], {
                    stdout: devnull(),
                  })

                case 3:
                  _context.next = 9
                  break

                case 5:
                  _context.prev = 5
                  _context.t0 = _context['catch'](0)
                  console.log(_context.t0)
                  process.exit(1)

                case 9:
                case 'end':
                  return _context.stop()
              }
            }
          },
          _callee,
          null,
          [[0, 5]]
        )
      })
    )

    return function compileContracts() {
      return _ref2.apply(this, arguments)
    }
  })()

module.exports = {
  runTruffle: runTruffle,
  compileContracts: compileContracts,
}
// # sourceMappingURL=truffle-runner.js.map
