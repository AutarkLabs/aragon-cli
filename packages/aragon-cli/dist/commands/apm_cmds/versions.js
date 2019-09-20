'use strict'

require('core-js/modules/es.array.concat')

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

var _require = require('../../helpers/web3-fallback')
var ensureWeb3 = _require.ensureWeb3

var APM = require('@aragon/apm')

var defaultAPMName = require('@aragon/cli-utils/src/helpers/default-apm')

var chalk = require('chalk')

exports.command = 'versions [apmRepo]'
exports.describe =
  'Shows all the previously published versions of a given repository'

exports.builder = function(yargs) {
  return yargs.option('apmRepo', {
    description: 'Name of the APM repository',
    type: 'string',
    default: null,
  })
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee(_ref) {
        var reporter,
          apmRepo,
          module,
          network,
          apmOptions,
          web3,
          repoName,
          versions
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                ;(reporter = _ref.reporter),
                  (apmRepo = _ref.apmRepo),
                  (module = _ref.module),
                  (network = _ref.network),
                  (apmOptions = _ref.apm)
                _context.next = 3
                return ensureWeb3(network)

              case 3:
                web3 = _context.sent
                repoName = apmRepo ? defaultAPMName(apmRepo) : module.appName
                apmOptions.ensRegistryAddress = apmOptions['ens-registry']
                _context.next = 8
                return APM(web3, apmOptions).getAllVersions(repoName)

              case 8:
                versions = _context.sent
                reporter.info(
                  ''
                    .concat(chalk.blue(repoName), ' has ')
                    .concat(chalk.green(versions.length), ' published versions')
                )
                versions.map(function(version) {
                  if (version && version.content) {
                    reporter.success(
                      ''
                        .concat(chalk.blue(version.version), ': ')
                        .concat(version.contractAddress, ' ')
                        .concat(version.content.provider, ':')
                        .concat(version.content.location)
                    )
                  } else if (version && version.error) {
                    reporter.warning(
                      ''
                        .concat(chalk.blue(version.version), ': ')
                        .concat(version.contractAddress, ' ')
                        .concat(version.error)
                    )
                  } else {
                    reporter.error(
                      ''
                        .concat(chalk.blue(version.version), ': ')
                        .concat(
                          version.contractAddress,
                          ' Version not found in provider'
                        )
                    )
                  }
                })
                process.exit()

              case 12:
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
// # sourceMappingURL=versions.js.map
