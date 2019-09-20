'use strict'

require('core-js/modules/es.array.map')

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

var execHandler = require('./utils/execHandler').handler

var daoArg = require('./utils/daoArg')

var _require = require('../../util')
var parseArgumentStringIfPossible = _require.parseArgumentStringIfPossible

exports.command = 'exec <dao> <proxy-address> <fn> [fn-args..]'
exports.describe = 'Executes a call in an app of a DAO'

exports.builder = function(yargs) {
  return daoArg(yargs)
    .positional('proxy-address', {
      description: 'Proxy address of the app with the function to be run',
    })
    .positional('fn', {
      description: 'Function to be executed',
    })
    .option('fn-args', {
      description: 'Arguments to be passed to the function',
      array: true,
      default: [],
    })
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee(_ref) {
        var reporter,
          dao,
          apm,
          network,
          proxyAddress,
          fn,
          fnArgs,
          wsProvider,
          getTransactionPath
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                ;(reporter = _ref.reporter),
                  (dao = _ref.dao),
                  (apm = _ref.apm),
                  (network = _ref.network),
                  (proxyAddress = _ref.proxyAddress),
                  (fn = _ref.fn),
                  (fnArgs = _ref.fnArgs),
                  (wsProvider = _ref.wsProvider)
                // TODO (daniel) refactor ConsoleReporter so we can do reporter.debug instead
                if (global.DEBUG_MODE)
                  console.log('fn-args before parsing', fnArgs)
                fnArgs = fnArgs.map(parseArgumentStringIfPossible)
                if (global.DEBUG_MODE)
                  console.log('fn-args after parsing', fnArgs)

                getTransactionPath = function getTransactionPath(wrapper) {
                  return wrapper.getTransactionPath(proxyAddress, fn, fnArgs)
                }

                return _context.abrupt(
                  'return',
                  execHandler(dao, getTransactionPath, {
                    ipfsCheck: true,
                    reporter: reporter,
                    apm: apm,
                    network: network,
                    wsProvider: wsProvider,
                  })
                )

              case 6:
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
// # sourceMappingURL=exec.js.map
