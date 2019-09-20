'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.string.bold')

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

var chalk = require('chalk')

var TaskList = require('listr')

var defaultAPMName = require('@aragon/cli-utils/src/helpers/default-apm')

var _require = require('../../helpers/web3-fallback')
var ensureWeb3 = _require.ensureWeb3

var getRepoTask = require('../dao_cmds/utils/getRepoTask')

exports.command = 'info <apmRepo> [apmRepoVersion]'
exports.describe = 'Get information about a package'
exports.builder = getRepoTask.args

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee(_ref) {
        var apmRepo, apmOptions, apmRepoVersion, network, web3, apm, tasks
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                ;(apmRepo = _ref.apmRepo),
                  (apmOptions = _ref.apm),
                  (apmRepoVersion = _ref.apmRepoVersion),
                  (network = _ref.network)
                _context.next = 3
                return ensureWeb3(network)

              case 3:
                web3 = _context.sent
                apmRepo = defaultAPMName(apmRepo)
                apmOptions.ensRegistryAddress = apmOptions['ens-registry']
                _context.next = 8
                return APM(web3, apmOptions)

              case 8:
                apm = _context.sent
                tasks = new TaskList([
                  {
                    title: 'Fetching '
                      .concat(chalk.bold(apmRepo), '@')
                      .concat(apmRepoVersion),
                    task: getRepoTask.task({
                      apm: apm,
                      apmRepo: apmRepo,
                      apmRepoVersion: apmRepoVersion,
                      artifactRequired: false,
                    }),
                  },
                ])
                return _context.abrupt(
                  'return',
                  tasks.run().then(function(ctx) {
                    delete ctx.repo.abi
                    delete ctx.repo.environments
                    console.log(JSON.stringify(ctx.repo, null, 2))
                    process.exit()
                  })
                )

              case 11:
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
// # sourceMappingURL=info.js.map
