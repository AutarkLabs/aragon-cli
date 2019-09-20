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

var path = require('path')

var TaskList = require('listr')

var chalk = require('chalk')

var _require = require('../../helpers/ipfs-daemon')
var startIPFSDaemon = _require.startIPFSDaemon
var isIPFSCORS = _require.isIPFSCORS
var setIPFSCORS = _require.setIPFSCORS
var isIPFSRunning = _require.isIPFSRunning

var IPFS = require('ipfs-api')

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

exports.command = 'start'
exports.describe = 'Start the IPFS daemon and configure it to work with Aragon.'

exports.task = function(_ref) {
  var apmOptions = _ref.apmOptions
  var silent = _ref.silent
  var debug = _ref.debug
  return new TaskList(
    [
      {
        title: 'Start IPFS',
        task: (function() {
          var _task2 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee(ctx, _task) {
              var running
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      if (!apmOptions.ipfs.rpc['default']) {
                        _context.next = 19
                        break
                      }

                      _context.next = 3
                      return isIPFSRunning(apmOptions.ipfs.rpc)

                    case 3:
                      running = _context.sent

                      if (running) {
                        _context.next = 13
                        break
                      }

                      _task.output =
                        'Starting IPFS at port: ' + apmOptions.ipfs.rpc.port
                      _context.next = 8
                      return startIPFSDaemon()

                    case 8:
                      ctx.started = true
                      _context.next = 11
                      return setIPFSCORS(apmOptions.ipfs.rpc)

                    case 11:
                      _context.next = 17
                      break

                    case 13:
                      _task.output = 'IPFS is started, checking CORS config'
                      _context.next = 16
                      return setIPFSCORS(apmOptions.ipfs.rpc)

                    case 16:
                      return _context.abrupt(
                        'return',
                        'Connected to IPFS daemon at port: ' +
                          apmOptions.ipfs.rpc.port
                      )

                    case 17:
                      _context.next = 22
                      break

                    case 19:
                      _context.next = 21
                      return isIPFSCORS(apmOptions.ipfs.rpc)

                    case 21:
                      return _context.abrupt(
                        'return',
                        'Connecting to provided IPFS daemon'
                      )

                    case 22:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee)
            })
          )

          function task(_x, _x2) {
            return _task2.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Add local files',
        task: function task(ctx) {
          var ipfs = IPFS('localhost', '5001', {
            protocol: 'http',
          })
          var files = path.resolve(
            require.resolve('@aragon/aragen'),
            '../ipfs-cache'
          )
          return new Promise(function(resolve, reject) {
            ipfs.util.addFromFs(
              files,
              {
                recursive: true,
                ignore: 'node_modules',
              },
              function(err, files) {
                if (err) return reject(err)
                resolve(files)
              }
            )
          })
        },
      },
    ],
    listrOpts(silent, debug)
  )
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref3 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee2(_ref2) {
        var reporter, apmOptions, task, ctx
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                ;(reporter = _ref2.reporter), (apmOptions = _ref2.apm)
                task = exports.task({
                  apmOptions: apmOptions,
                })
                _context2.next = 4
                return task.run()

              case 4:
                ctx = _context2.sent

                if (ctx.started) {
                  reporter.info(
                    'IPFS daemon is now running. Stopping this process will stop IPFS'
                  )
                } else {
                  reporter.warning(chalk.yellow("Didn't start IPFS, port busy"))
                  process.exit()
                }

              case 6:
              case 'end':
                return _context2.stop()
            }
          }
        }, _callee2)
      })
    )

    return function(_x3) {
      return _ref3.apply(this, arguments)
    }
  })()
// # sourceMappingURL=start.js.map
