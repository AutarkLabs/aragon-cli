'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.map')

require('core-js/modules/es.array.slice')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.string.replace')

require('core-js/modules/es.string.split')

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

var ABI = require('web3-eth-abi')

var execHandler = require('./utils/execHandler').handler

var getAppKernel = require('./utils/app-kernel')

var _require = require('../../helpers/web3-fallback')
var ensureWeb3 = _require.ensureWeb3

var _require2 = require('../../util')
var parseArgumentStringIfPossible = _require2.parseArgumentStringIfPossible
var ZERO_ADDRESS = _require2.ZERO_ADDRESS

var EXECUTE_FUNCTION_NAME = 'execute'
exports.command = 'act <agent-address> <target> <signature> [call-args..]'
exports.describe = 'Executes an action from the Agent app'

exports.builder = function(yargs) {
  return yargs
    .positional('agent-address', {
      description: 'Address of the Agent app proxy',
      type: 'string',
    })
    .positional('target', {
      description: 'Address where the action is being executed',
      type: 'string',
    })
    .positional('signature', {
      description:
        'Signature of the function to be executed (e.g. "myMethod(uint256,string)"',
      type: 'string',
    })
    .option('call-args', {
      description: 'Arguments to be passed to the function',
      array: true,
      default: [],
    })
    .option('eth-value', {
      description:
        'Amount of ETH from the contract that is sent with the action',
      default: '0',
    })
}

var encodeCalldata = function encodeCalldata(signature, params) {
  var sigBytes = ABI.encodeFunctionSignature(signature)
  var types = signature.replace(')', '').split('(')[1] // No params, return signature directly

  if (types === '') {
    return sigBytes
  }

  var paramBytes = ABI.encodeParameters(types.split(','), params)
  return ''.concat(sigBytes).concat(paramBytes.slice(2))
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee(_ref) {
        var reporter,
          apm,
          network,
          agentAddress,
          target,
          signature,
          callArgs,
          ethValue,
          wsProvider,
          web3,
          dao,
          weiAmount,
          fnArgs,
          getTransactionPath
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                ;(reporter = _ref.reporter),
                  (apm = _ref.apm),
                  (network = _ref.network),
                  (agentAddress = _ref.agentAddress),
                  (target = _ref.target),
                  (signature = _ref.signature),
                  (callArgs = _ref.callArgs),
                  (ethValue = _ref.ethValue),
                  (wsProvider = _ref.wsProvider)
                // TODO (daniel) refactor ConsoleReporter so we can do reporter.debug instead
                if (global.DEBUG_MODE)
                  console.log('call-args before parsing', callArgs)
                callArgs = callArgs.map(parseArgumentStringIfPossible)
                if (global.DEBUG_MODE)
                  console.log('call-args after parsing', callArgs)
                _context.next = 6
                return ensureWeb3(network)

              case 6:
                web3 = _context.sent
                _context.next = 9
                return getAppKernel(web3, agentAddress)

              case 9:
                dao = _context.sent

                if (!(dao === ZERO_ADDRESS)) {
                  _context.next = 12
                  break
                }

                throw new Error(
                  'Invalid Agent app address, cannot find Kernel reference in contract'
                )

              case 12:
                weiAmount = web3.utils.toWei(ethValue)
                fnArgs = [
                  target,
                  weiAmount,
                  encodeCalldata(signature, callArgs),
                ]

                getTransactionPath = function getTransactionPath(wrapper) {
                  return wrapper.getTransactionPath(
                    agentAddress,
                    EXECUTE_FUNCTION_NAME,
                    fnArgs
                  )
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

              case 16:
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
// # sourceMappingURL=act.js.map
