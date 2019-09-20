'use strict'

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

var startIPFS = require('./start')

exports.command = 'view <cid>'
exports.describe =
  'Display metadata about the content, such as size, links, etc.'

exports.builder = function(yargs) {
  // TODO add support for "ipfs paths", e.g: QmP49YSJVhQTySqLDFTzFZPG8atf3CLsQSPDVj3iATQkhC/arapp.json
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
      // TODO validation of the CID
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
                      ctx.merkleDAG = _context2.sent

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
    ],
    (0, _listrOptions['default'])(silent, debug)
  )
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref3 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee3(_ref2) {
        var reporter, apmOptions, cid, debug, silent, task, ctx
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                ;(reporter = _ref2.reporter),
                  (apmOptions = _ref2.apm),
                  (cid = _ref2.cid),
                  (debug = _ref2.debug),
                  (silent = _ref2.silent)
                _context3.next = 3
                return exports.task({
                  reporter: reporter,
                  apmOptions: apmOptions,
                  cid: cid,
                  debug: debug,
                  silent: silent,
                })

              case 3:
                task = _context3.sent
                _context3.next = 6
                return task.run()

              case 6:
                ctx = _context3.sent
                console.log((0, _ipfs.stringifyMerkleDAG)(ctx.merkleDAG))

              case 8:
              case 'end':
                return _context3.stop()
            }
          }
        }, _callee3)
      })
    )

    return function(_x3) {
      return _ref3.apply(this, arguments)
    }
  })()
// # sourceMappingURL=view.js.map
