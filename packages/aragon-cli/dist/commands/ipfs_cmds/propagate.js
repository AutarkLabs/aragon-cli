'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.join')

require('core-js/modules/es.array.map')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('regenerator-runtime/runtime')

var _listr = _interopRequireDefault(require('listr'))

var _ipfs = require('../../lib/ipfs')

var _listrOptions = _interopRequireDefault(
  require('@aragon/cli-utils/src/helpers/listr-options')
)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
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

var chalk = require('chalk')

var startIPFS = require('./start')

exports.command = 'propagate <cid>'
exports.describe =
  'Request the content and its links at several gateways, making the files more distributed within the network.'

exports.builder = function(yargs) {
  return yargs.positional('cid', {
    description: 'A self-describing content-addressed identifier',
  })
}

exports.task = function(_ref) {
  var apmOptions = _ref.apmOptions
  var silent = _ref.silent
  var debug = _ref.debug
  var cid = _ref.cid
  return new _listr['default'](
    [
      {
        title: 'Check IPFS',
        task: function task() {
          return startIPFS.task({
            apmOptions: apmOptions,
          })
        },
      },
      {
        title: 'Connect to IPFS',
        task: (function() {
          var _task = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee(ctx) {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      _context.next = 2
                      return (0, _ipfs.ensureConnection)(apmOptions.ipfs.rpc)

                    case 2:
                      ctx.ipfs = _context.sent

                    case 3:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee)
            })
          )

          function task(_x) {
            return _task.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Fetch the links',
        task: (function() {
          var _task2 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee2(ctx) {
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      _context2.next = 2
                      return (0, _ipfs.getMerkleDAG)(ctx.ipfs.client, cid, {
                        recursive: true,
                      })

                    case 2:
                      ctx.data = _context2.sent

                    case 3:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2)
            })
          )

          function task(_x2) {
            return _task2.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Query gateways',
        task: (function() {
          var _task4 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee3(ctx, _task3) {
              var logger
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch ((_context3.prev = _context3.next)) {
                    case 0:
                      ctx.CIDs = (0, _ipfs.extractCIDsFromMerkleDAG)(ctx.data, {
                        recursive: true,
                      })

                      logger = function logger(text) {
                        return (_task3.output = text)
                      }

                      _context3.next = 4
                      return (0, _ipfs.propagateFiles)(ctx.CIDs, logger)

                    case 4:
                      ctx.result = _context3.sent

                    case 5:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3)
            })
          )

          function task(_x3, _x4) {
            return _task4.apply(this, arguments)
          }

          return task
        })(),
      },
    ],
    (0, _listrOptions['default'])(silent, debug)
  )
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref3 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee4(_ref2) {
        var reporter, apmOptions, cid, debug, silent, task, ctx
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch ((_context4.prev = _context4.next)) {
              case 0:
                ;(reporter = _ref2.reporter),
                  (apmOptions = _ref2.apm),
                  (cid = _ref2.cid),
                  (debug = _ref2.debug),
                  (silent = _ref2.silent)
                _context4.next = 3
                return exports.task({
                  apmOptions: apmOptions,
                  cid: cid,
                  debug: debug,
                  silent: silent,
                })

              case 3:
                task = _context4.sent
                _context4.next = 6
                return task.run()

              case 6:
                ctx = _context4.sent
                console.log(
                  '\n',
                  'Queried '
                    .concat(chalk.blue(ctx.CIDs.length), ' CIDs at ')
                    .concat(
                      chalk.blue(ctx.result.gateways.length),
                      ' gateways'
                    ),
                  '\n',
                  'Requests succeeded: '.concat(
                    chalk.green(ctx.result.succeeded)
                  ),
                  '\n',
                  'Requests failed: '.concat(chalk.red(ctx.result.failed)),
                  '\n'
                )
                reporter.debug(
                  'Gateways: '.concat(ctx.result.gateways.join(', '))
                )
                reporter.debug(
                  'Errors: \n'.concat(
                    ctx.result.errors.map(JSON.stringify).join('\n')
                  )
                ) // TODO add your own gateways

                process.exit()

              case 11:
              case 'end':
                return _context4.stop()
            }
          }
        }, _callee4)
      })
    )

    return function(_x5) {
      return _ref3.apply(this, arguments)
    }
  })()
// # sourceMappingURL=propagate.js.map
