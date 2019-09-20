'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.symbol.iterator')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.string.iterator')

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

var APM = require('@aragon/apm')

var ACL = require('../../acl')

var _require = require('../../helpers/web3-fallback')
var ensureWeb3 = _require.ensureWeb3

var chalk = require('chalk')

exports.command = 'grant [grantees..]'
exports.describe =
  'Grant an address permission to create new versions in this package'

exports.builder = function(yargs) {
  return yargs.positional('grantees', {
    description:
      'The address being granted the permission to publish to the repo',
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
          gasPrice,
          cwd,
          network,
          module,
          apmOptions,
          grantees,
          web3,
          apm,
          acl,
          repo,
          _iteratorNormalCompletion,
          _didIteratorError,
          _iteratorError,
          _iterator,
          _step,
          address,
          accounts,
          from,
          transaction,
          receipt

        return regeneratorRuntime.wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  ;(reporter = _ref.reporter),
                    (gasPrice = _ref.gasPrice),
                    (cwd = _ref.cwd),
                    (network = _ref.network),
                    (module = _ref.module),
                    (apmOptions = _ref.apm),
                    (grantees = _ref.grantees)
                  _context.next = 3
                  return ensureWeb3(network)

                case 3:
                  web3 = _context.sent
                  apmOptions.ensRegistryAddress = apmOptions['ens-registry']
                  _context.next = 7
                  return APM(web3, apmOptions)

                case 7:
                  apm = _context.sent
                  acl = ACL({
                    web3: web3,
                    network: network,
                  })
                  _context.next = 11
                  return apm.getRepository(module.appName)['catch'](function() {
                    return null
                  })

                case 11:
                  repo = _context.sent

                  if (!(repo === null)) {
                    _context.next = 14
                    break
                  }

                  throw new Error(
                    'Repository '.concat(
                      module.appName,
                      " does not exist and it's registry does not exist"
                    )
                  )

                case 14:
                  if (grantees.length === 0) {
                    reporter.warning('No grantee addresses provided')
                  }
                  /* eslint-disable-next-line */

                  _iteratorNormalCompletion = true
                  _didIteratorError = false
                  _iteratorError = undefined
                  _context.prev = 18
                  _iterator = grantees[Symbol.iterator]()

                case 20:
                  if (
                    (_iteratorNormalCompletion = (_step = _iterator.next())
                      .done)
                  ) {
                    _context.next = 46
                    break
                  }

                  address = _step.value
                  reporter.info(
                    'Granting permission to publish on '
                      .concat(chalk.blue(module.appName), ' for ')
                      .concat(chalk.green(address))
                  ) // Decode sender

                  _context.next = 25
                  return web3.eth.getAccounts()

                case 25:
                  accounts = _context.sent
                  from = accounts[0] // Build transaction

                  _context.next = 29
                  return acl.grant(repo.options.address, address)

                case 29:
                  transaction = _context.sent
                  transaction.from = from
                  transaction.gasPrice = network.gasPrice || gasPrice // the recommended gasLimit is already calculated by the ACL module

                  _context.prev = 32
                  _context.next = 35
                  return web3.eth.sendTransaction(transaction)

                case 35:
                  receipt = _context.sent
                  reporter.success(
                    'Successful transaction ('.concat(
                      chalk.blue(receipt.transactionHash),
                      ')'
                    )
                  )
                  _context.next = 43
                  break

                case 39:
                  _context.prev = 39
                  _context.t0 = _context['catch'](32)
                  reporter.error(
                    ''
                      .concat(_context.t0, '\n')
                      .concat(chalk.red('Transaction failed'))
                  )
                  process.exit(1)

                case 43:
                  _iteratorNormalCompletion = true
                  _context.next = 20
                  break

                case 46:
                  _context.next = 52
                  break

                case 48:
                  _context.prev = 48
                  _context.t1 = _context['catch'](18)
                  _didIteratorError = true
                  _iteratorError = _context.t1

                case 52:
                  _context.prev = 52
                  _context.prev = 53

                  if (
                    !_iteratorNormalCompletion &&
                    _iterator['return'] != null
                  ) {
                    _iterator['return']()
                  }

                case 55:
                  _context.prev = 55

                  if (!_didIteratorError) {
                    _context.next = 58
                    break
                  }

                  throw _iteratorError

                case 58:
                  return _context.finish(55)

                case 59:
                  return _context.finish(52)

                case 60:
                  process.exit(0)

                case 61:
                case 'end':
                  return _context.stop()
              }
            }
          },
          _callee,
          null,
          [[18, 48, 52, 60], [32, 39], [53, , 55, 59]]
        )
      })
    )

    return function(_x) {
      return _ref2.apply(this, arguments)
    }
  })()
// # sourceMappingURL=grant.js.map
