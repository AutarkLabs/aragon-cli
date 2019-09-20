'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.checkProjectExists = checkProjectExists

require('regenerator-runtime/runtime')

var _path = _interopRequireDefault(require('path'))

var _fsExtra = _interopRequireDefault(require('fs-extra'))

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

function checkProjectExists(_x) {
  return _checkProjectExists.apply(this, arguments)
}

function _checkProjectExists() {
  _checkProjectExists = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee(basename) {
      var projectPath, exists
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              projectPath = _path['default'].resolve(process.cwd(), basename)
              _context.next = 3
              return _fsExtra['default'].pathExists(projectPath)

            case 3:
              exists = _context.sent

              if (!exists) {
                _context.next = 6
                break
              }

              throw new Error(
                "Couldn't initialize project. Project with name "
                  .concat(basename, ' already exists in ')
                  .concat(
                    projectPath,
                    '. Use different <name> or rename existing project folder.'
                  )
              )

            case 6:
            case 'end':
              return _context.stop()
          }
        }
      }, _callee)
    })
  )
  return _checkProjectExists.apply(this, arguments)
}
// # sourceMappingURL=check-project-exists.js.map