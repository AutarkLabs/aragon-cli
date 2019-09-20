'use strict'

require('core-js/modules/es.array.for-each')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.array.map')

require('core-js/modules/es.date.to-string')

require('core-js/modules/es.function.name')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.iterator')

require('core-js/modules/web.dom-collections.for-each')

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

var chalk = require('chalk')

var Table = require('cli-table')

var TaskList = require('listr')

var _require = require('../../helpers/web3-fallback')
var ensureWeb3 = _require.ensureWeb3

exports.command = 'packages [apmRegistry]'
exports.describe = 'List all packages in the registry'

exports.builder = function(yargs) {
  return yargs.option('apmRegistry', {
    description: 'The registry to inspect',
    type: 'string',
    default: 'aragonpm.eth',
  })
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref2 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee4(_ref) {
        var reporter, apmRegistry, network, apmOptions, web3, apm, tasks
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch ((_context4.prev = _context4.next)) {
              case 0:
                ;(reporter = _ref.reporter),
                  (apmRegistry = _ref.apmRegistry),
                  (network = _ref.network),
                  (apmOptions = _ref.apm)
                _context4.next = 3
                return ensureWeb3(network)

              case 3:
                web3 = _context4.sent
                apmOptions.ensRegistryAddress = apmOptions['ens-registry']
                apm = APM(web3, apmOptions)
                tasks = new TaskList([
                  {
                    title: 'Fetching APM Registry: '.concat(apmRegistry),
                    task: (function() {
                      var _task2 = _asyncToGenerator(
                        /* #__PURE__ */
                        regeneratorRuntime.mark(function _callee(ctx, _task) {
                          return regeneratorRuntime.wrap(function _callee$(
                            _context
                          ) {
                            while (1) {
                              switch ((_context.prev = _context.next)) {
                                case 0:
                                  _context.next = 2
                                  return apm.getRepoRegistry(
                                    'vault.'.concat(apmRegistry)
                                  )

                                case 2:
                                  ctx.registry = _context.sent

                                case 3:
                                case 'end':
                                  return _context.stop()
                              }
                            }
                          },
                          _callee)
                        })
                      )

                      function task(_x2, _x3) {
                        return _task2.apply(this, arguments)
                      }

                      return task
                    })(),
                  },
                  {
                    title: 'Gathering Repos',
                    task: (function() {
                      var _task4 = _asyncToGenerator(
                        /* #__PURE__ */
                        regeneratorRuntime.mark(function _callee3(ctx, _task3) {
                          var e
                          return regeneratorRuntime.wrap(function _callee3$(
                            _context3
                          ) {
                            while (1) {
                              switch ((_context3.prev = _context3.next)) {
                                case 0:
                                  _context3.next = 2
                                  return ctx.registry.getPastEvents('NewRepo', {
                                    fromBlock: 0,
                                  })

                                case 2:
                                  e = _context3.sent
                                  ctx.names = e.map(function(ev) {
                                    return ev.returnValues.name
                                  })
                                  _context3.next = 6
                                  return Promise.all(
                                    e.map(
                                      /* #__PURE__ */
                                      (function() {
                                        var _ref3 = _asyncToGenerator(
                                          /* #__PURE__ */
                                          regeneratorRuntime.mark(
                                            function _callee2(ev) {
                                              return regeneratorRuntime.wrap(
                                                function _callee2$(_context2) {
                                                  while (1) {
                                                    switch (
                                                      (_context2.prev =
                                                        _context2.next)
                                                    ) {
                                                      case 0:
                                                        return _context2.abrupt(
                                                          'return',
                                                          apm.getLatestVersion(
                                                            ev.returnValues.id
                                                          )
                                                        )

                                                      case 1:
                                                      case 'end':
                                                        return _context2.stop()
                                                    }
                                                  }
                                                },
                                                _callee2
                                              )
                                            }
                                          )
                                        )

                                        return function(_x6) {
                                          return _ref3.apply(this, arguments)
                                        }
                                      })()
                                    )
                                  )

                                case 6:
                                  ctx.versions = _context3.sent

                                case 7:
                                case 'end':
                                  return _context3.stop()
                              }
                            }
                          },
                          _callee3)
                        })
                      )

                      function task(_x4, _x5) {
                        return _task4.apply(this, arguments)
                      }

                      return task
                    })(),
                  },
                ])
                return _context4.abrupt(
                  'return',
                  tasks.run().then(function(ctx) {
                    reporter.success('Successfully fetched packages')
                    var rows = ctx.versions.map(function(info, index) {
                      return [ctx.names[index], info.version]
                    })
                    var table = new Table({
                      head: ['App', 'Latest Version'].map(function(x) {
                        return chalk.white(x)
                      }),
                    })
                    rows.forEach(function(r) {
                      return table.push(r)
                    })
                    console.log(table.toString())
                    process.exit()
                  })
                )

              case 8:
              case 'end':
                return _context4.stop()
            }
          }
        }, _callee4)
      })
    )

    return function(_x) {
      return _ref2.apply(this, arguments)
    }
  })()
// # sourceMappingURL=packages.js.map
