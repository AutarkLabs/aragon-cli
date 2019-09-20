'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.includes')

require('core-js/modules/es.function.name')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.string.includes')

require('core-js/modules/es.string.split')

require('regenerator-runtime/runtime')

var _init = require('../lib/init')

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

var _require = require('util')
var promisify = _require.promisify

var clone = promisify(require('git-clone'))

var TaskList = require('listr')

var _require2 = require('../util')
var installDeps = _require2.installDeps
var isValidAragonId = _require2.isValidAragonId

var defaultAPMName = require('@aragon/cli-utils/src/helpers/default-apm')

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

exports.command = 'init <name> [template]'
exports.describe =
  '(deprecated) Initialise a new application. Deprecated in favor of `npx create-aragon-app <name> [template]`'

exports.builder = function(yargs) {
  return yargs
    .positional('name', {
      description: 'The application name (appname.aragonpm.eth)',
    })
    .option('cwd', {
      description: 'The current working directory',
      default: process.cwd(),
    })
    .positional('template', {
      description: 'The template to scaffold from',
      default: 'react',
      coerce: function resolveTemplateName(tmpl) {
        var aliases = {
          bare: 'aragon/aragon-bare-boilerplate',
          react: 'aragon/aragon-react-boilerplate',
        }

        if (!tmpl.includes('/')) {
          if (tmpl === 'react-kit') {
            throw new Error(
              "Template 'react-kit' was merged with 'react' template."
            )
          } else if (!aliases[tmpl]) {
            throw new Error('No template named '.concat(tmpl, ' exists'))
          }

          tmpl = aliases[tmpl]
        }

        return 'https://github.com/'.concat(tmpl)
      },
    })
}

exports.handler = function(_ref) {
  var reporter = _ref.reporter
  var name = _ref.name
  var template = _ref.template
  var silent = _ref.silent
  var debug = _ref.debug
  name = defaultAPMName(name)
  var basename = name.split('.')[0]
  var tasks = new TaskList(
    [
      {
        title: 'Preparing initialization',
        task: (function() {
          var _task2 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee(ctx, _task) {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      _task.output =
                        'Checking if project folder already exists...'

                      if (isValidAragonId(basename)) {
                        _context.next = 3
                        break
                      }

                      throw new Error(
                        reporter.error(
                          'Invalid project name. Please only use lowercase alphanumeric and hyphen characters.'
                        )
                      )

                    case 3:
                      _context.next = 5
                      return (0, _init.checkProjectExists)(basename)

                    case 5:
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
        title: 'Cloning app template',
        task: (function() {
          var _task4 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee2(ctx, _task3) {
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      _task3.output = 'Cloning '
                        .concat(template, ' into ')
                        .concat(basename, '...')
                      _context2.next = 3
                      return clone(template, basename, {
                        shallow: true,
                      })

                    case 3:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2)
            })
          )

          function task(_x3, _x4) {
            return _task4.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Preparing template',
        task: (function() {
          var _task6 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee3(ctx, _task5) {
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch ((_context3.prev = _context3.next)) {
                    case 0:
                      _task5.output =
                        'Initiliazing arapp.json and removing Git repository'
                      _context3.next = 3
                      return (0, _init.prepareTemplate)(basename, name)

                    case 3:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3)
            })
          )

          function task(_x5, _x6) {
            return _task6.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Installing package dependencies',
        task: (function() {
          var _task8 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee4(ctx, _task7) {
              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch ((_context4.prev = _context4.next)) {
                    case 0:
                      return _context4.abrupt(
                        'return',
                        installDeps(basename, _task7)
                      )

                    case 1:
                    case 'end':
                      return _context4.stop()
                  }
                }
              }, _callee4)
            })
          )

          function task(_x7, _x8) {
            return _task8.apply(this, arguments)
          }

          return task
        })(),
      },
    ],
    listrOpts(silent, debug)
  )
  return tasks.run().then(function() {
    reporter.success(
      'Created new application '.concat(name, ' in ').concat(basename, '.')
    )
    reporter.warning(
      'Use of `aragon init` is deprecated and has been replaced with `npx create-aragon-app`.'
    )
  })
}
// # sourceMappingURL=init.js.map
