'use strict'

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.array.map')

require('core-js/modules/es.date.to-string')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.to-string')

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

var path = require('path')

var ignore = require('ignore')

var fs = require('fs')

var _require = require('../../../util')
var findProjectRoot = _require.findProjectRoot

var _require2 = require('fs-extra')
var copy = _require2.copy
var pathExistsSync = _require2.pathExistsSync

var _require3 = require('util')
var promisify = _require3.promisify

var MANIFEST_FILE = 'manifest.json'
var ARTIFACT_FILE = 'artifact.json'
/**
 * Moves the specified files to a temporary directory and returns the path to
 * the temporary directory.
 * @param {string} tmpDir Temporary directory
 * @param {Array<string>} files An array of file paths to include
 * @param {string} ignorePatterns An array of glob-like pattern of files to ignore
 * @return {string} The path to the temporary directory
 */

function prepareFilesForPublishing(_x) {
  return _prepareFilesForPublishing.apply(this, arguments)
}

function _prepareFilesForPublishing() {
  _prepareFilesForPublishing = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee2(tmpDir) {
      var files
      var ignorePatterns
      var filter
      var projectRoot
      var ipfsignorePath
      var ipfsignoreFile
      var gitignorePath
      var gitignoreFile
      var filterIgnoredFiles
      var manifestOrigin
      var manifestDst
      var artifactOrigin
      var artifactDst
      var _args2 = arguments
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch ((_context2.prev = _context2.next)) {
            case 0:
              filterIgnoredFiles = function _ref2(src) {
                var relativeSrc = path.relative(projectRoot, src)
                return relativeSrc === '' ? true : !filter.ignores(relativeSrc)
              }

              files =
                _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : []
              ignorePatterns =
                _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : null
              // Ignored files filter
              filter = ignore().add(ignorePatterns)
              projectRoot = findProjectRoot()
              ipfsignorePath = path.resolve(projectRoot, '.ipfsignore')

              if (pathExistsSync(ipfsignorePath)) {
                ipfsignoreFile = fs.readFileSync(ipfsignorePath).toString()
                filter.add(ipfsignoreFile)
              } else {
                gitignorePath = path.resolve(projectRoot, '.gitignore')

                if (pathExistsSync(gitignorePath)) {
                  gitignoreFile = fs.readFileSync(gitignorePath).toString()
                  filter.add(gitignoreFile)
                }
              }

              _context2.next = 9
              return Promise.all(
                files.map(
                  /* #__PURE__ */
                  (function() {
                    var _ref = _asyncToGenerator(
                      /* #__PURE__ */
                      regeneratorRuntime.mark(function _callee(file) {
                        var stats, destination
                        return regeneratorRuntime.wrap(function _callee$(
                          _context
                        ) {
                          while (1) {
                            switch ((_context.prev = _context.next)) {
                              case 0:
                                _context.next = 2
                                return promisify(fs.lstat)(file)

                              case 2:
                                stats = _context.sent
                                destination = tmpDir

                                if (stats.isFile()) {
                                  destination = path.resolve(tmpDir, file)
                                } // check files are not ignored

                                if (filter.ignores(file))
                                  filter.add('!'.concat(file))
                                if (filter.ignores(file + '/'))
                                  filter.add('!'.concat(file, '/'))
                                return _context.abrupt(
                                  'return',
                                  copy(file, destination, {
                                    filter: filterIgnoredFiles,
                                  })
                                )

                              case 8:
                              case 'end':
                                return _context.stop()
                            }
                          }
                        },
                        _callee)
                      })
                    )

                    return function(_x2) {
                      return _ref.apply(this, arguments)
                    }
                  })()
                )
              )

            case 9:
              manifestOrigin = path.resolve(projectRoot, MANIFEST_FILE)
              manifestDst = path.resolve(tmpDir, MANIFEST_FILE)

              if (
                !(
                  !pathExistsSync(manifestDst) && pathExistsSync(manifestOrigin)
                )
              ) {
                _context2.next = 14
                break
              }

              _context2.next = 14
              return copy(manifestOrigin, manifestDst)

            case 14:
              artifactOrigin = path.resolve(projectRoot, ARTIFACT_FILE)
              artifactDst = path.resolve(tmpDir, ARTIFACT_FILE)

              if (
                !(
                  !pathExistsSync(artifactDst) && pathExistsSync(artifactOrigin)
                )
              ) {
                _context2.next = 19
                break
              }

              _context2.next = 19
              return copy(artifactOrigin, artifactDst)

            case 19:
              return _context2.abrupt('return', tmpDir)

            case 20:
            case 'end':
              return _context2.stop()
          }
        }
      }, _callee2)
    })
  )
  return _prepareFilesForPublishing.apply(this, arguments)
}

module.exports = {
  MANIFEST_FILE: MANIFEST_FILE,
  ARTIFACT_FILE: ARTIFACT_FILE,
  prepareFilesForPublishing: prepareFilesForPublishing,
}
// # sourceMappingURL=preprare-files.js.map
