'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.filter')

require('core-js/modules/es.array.find')

require('core-js/modules/es.array.for-each')

require('core-js/modules/es.array.index-of')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.array.map')

require('core-js/modules/es.array.reverse')

require('core-js/modules/es.array.some')

require('core-js/modules/es.object.assign')

require('core-js/modules/es.object.define-properties')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.get-own-property-descriptor')

require('core-js/modules/es.object.get-own-property-descriptors')

require('core-js/modules/es.object.keys')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.set')

require('core-js/modules/es.string.iterator')

require('core-js/modules/es.string.split')

require('core-js/modules/web.dom-collections.for-each')

require('core-js/modules/web.dom-collections.iterator')

require('regenerator-runtime/runtime')

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object)
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object)
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable
      })
    keys.push.apply(keys, symbols)
  }
  return keys
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {}
    if (i % 2) {
      ownKeys(source, true).forEach(function(key) {
        _defineProperty(target, key, source[key])
      })
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
    } else {
      ownKeys(source).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        )
      })
    }
  }
  return target
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }
  return obj
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

var fs = require('fs')

var path = require('path')

var _require = require('fs-extra')
var readJson = _require.readJson
var writeJson = _require.writeJson

var flatten = require('truffle-flattener')

var extract = require('../../../helpers/solidity-extractor')

var namehash = require('eth-ens-namehash')

var taskInput = require('listr-input')

var _require2 = require('js-sha3')
var keccak256 = _require2.keccak256

var _require3 = require('./preprare-files')
var ARTIFACT_FILE = _require3.ARTIFACT_FILE

var SOLIDITY_FILE = 'code.sol'
var ARAPP_FILE = 'arapp.json'
var POSITIVE_ANSWERS = ['yes', 'y']
var NEGATIVE_ANSWERS = ['no', 'n', 'abort', 'a']
var ANSWERS = POSITIVE_ANSWERS.concat(NEGATIVE_ANSWERS)

var getMajor = function getMajor(version) {
  return version.split('.')[0]
}

var getRoles = function getRoles(roles) {
  return roles.map(function(role) {
    return Object.assign(role, {
      bytes: '0x' + keccak256(role.id),
    })
  })
}

function getEnvironments(_x) {
  return _getEnvironments.apply(this, arguments)
}

function _getEnvironments() {
  _getEnvironments = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee(cwd) {
      var arappManifestPath, arappManifestFile
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              arappManifestPath = path.resolve(cwd, ARAPP_FILE)
              _context.next = 3
              return readJson(arappManifestPath)

            case 3:
              arappManifestFile = _context.sent
              return _context.abrupt('return', arappManifestFile.environments)

            case 5:
            case 'end':
              return _context.stop()
          }
        }
      }, _callee)
    })
  )
  return _getEnvironments.apply(this, arguments)
}

function getContractAbi(_x2, _x3) {
  return _getContractAbi.apply(this, arguments)
}

function _getContractAbi() {
  _getContractAbi = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee2(cwd, contractPath) {
      var contractInterfacePath, contractInterface
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch ((_context2.prev = _context2.next)) {
            case 0:
              contractInterfacePath = path.resolve(
                cwd,
                'build/contracts',
                path.basename(contractPath, '.sol') + '.json'
              )
              _context2.next = 3
              return readJson(contractInterfacePath)

            case 3:
              contractInterface = _context2.sent
              return _context2.abrupt('return', contractInterface.abi)

            case 5:
            case 'end':
              return _context2.stop()
          }
        }
      }, _callee2)
    })
  )
  return _getContractAbi.apply(this, arguments)
}

function decorateFunctionsWithAbi(functions, abi, web3) {
  var abiFunctions = abi.filter(function(elem) {
    return elem.type === 'function'
  })
  functions.forEach(function(f) {
    f.abi = abiFunctions.find(function(elem) {
      return (
        web3.eth.abi.encodeFunctionSignature(elem) ===
        web3.eth.abi.encodeFunctionSignature(f.sig)
      )
    })
  })
}

function deprecatedFunctions(_x4, _x5, _x6, _x7) {
  return _deprecatedFunctions.apply(this, arguments)
}

function _deprecatedFunctions() {
  _deprecatedFunctions = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee5(apm, artifact, web3, reporter) {
      var deprecatedFunctions, deprecatedFunctionsSig, versions, lastMajor
      return regeneratorRuntime.wrap(
        function _callee5$(_context5) {
          while (1) {
            switch ((_context5.prev = _context5.next)) {
              case 0:
                deprecatedFunctions = {}
                _context5.prev = 1
                deprecatedFunctionsSig = new Set()
                _context5.next = 5
                return apm.getAllVersions(artifact.appName)

              case 5:
                versions = _context5.sent
                lastMajor = -1
                versions.reverse().forEach(
                  /* #__PURE__ */
                  (function() {
                    var _ref = _asyncToGenerator(
                      /* #__PURE__ */
                      regeneratorRuntime.mark(function _callee4(version) {
                        var deprecatedOnVersion
                        return regeneratorRuntime.wrap(function _callee4$(
                          _context4
                        ) {
                          while (1) {
                            switch ((_context4.prev = _context4.next)) {
                              case 0:
                                deprecatedOnVersion = [] // iterate on major versions

                                if (
                                  !(getMajor(version.version) !== lastMajor)
                                ) {
                                  _context4.next = 10
                                  break
                                }

                                lastMajor = getMajor(version.version)

                                if (!version.functions) {
                                  _context4.next = 8
                                  break
                                }

                                version.functions.forEach(function(f) {
                                  if (
                                    !artifact.functions.some(function(obj) {
                                      return obj.sig === f.sig
                                    }) &&
                                    !deprecatedFunctionsSig.has(f.sig)
                                  ) {
                                    deprecatedOnVersion.push(f)
                                    deprecatedFunctionsSig.add(f.sig)
                                  }
                                })

                                if (deprecatedOnVersion.length) {
                                  deprecatedFunctions[
                                    ''.concat(lastMajor, '.0.0')
                                  ] = deprecatedOnVersion
                                  decorateFunctionsWithAbi(
                                    deprecatedOnVersion,
                                    version.abi,
                                    web3
                                  )
                                  deprecatedOnVersion = []
                                }

                                _context4.next = 10
                                break

                              case 8:
                                reporter.warning(
                                  'Cannot find artifacts for version '.concat(
                                    version.version,
                                    ' in aragonPM. Please make sure the package was published and your IPFS or HTTP server are running.\n'
                                  )
                                )
                                return _context4.abrupt(
                                  'return',
                                  taskInput('Abort publication? [y]es/[n]o', {
                                    validate: function validate(value) {
                                      return ANSWERS.indexOf(value) > -1
                                    },
                                    done: (function() {
                                      var _done = _asyncToGenerator(
                                        /* #__PURE__ */
                                        regeneratorRuntime.mark(
                                          function _callee3(answer) {
                                            return regeneratorRuntime.wrap(
                                              function _callee3$(_context3) {
                                                while (1) {
                                                  switch (
                                                    (_context3.prev =
                                                      _context3.next)
                                                  ) {
                                                    case 0:
                                                      if (
                                                        !(
                                                          POSITIVE_ANSWERS.indexOf(
                                                            answer
                                                          ) > -1
                                                        )
                                                      ) {
                                                        _context3.next = 2
                                                        break
                                                      }

                                                      throw new Error(
                                                        'Aborting publication...'
                                                      )

                                                    case 2:
                                                    case 'end':
                                                      return _context3.stop()
                                                  }
                                                }
                                              },
                                              _callee3
                                            )
                                          }
                                        )
                                      )

                                      function done(_x29) {
                                        return _done.apply(this, arguments)
                                      }

                                      return done
                                    })(),
                                  })
                                )

                              case 10:
                              case 'end':
                                return _context4.stop()
                            }
                          }
                        },
                        _callee4)
                      })
                    )

                    return function(_x28) {
                      return _ref.apply(this, arguments)
                    }
                  })()
                )
                _context5.next = 12
                break

              case 10:
                _context5.prev = 10
                _context5.t0 = _context5['catch'](1)

              case 12:
                return _context5.abrupt('return', deprecatedFunctions)

              case 13:
              case 'end':
                return _context5.stop()
            }
          }
        },
        _callee5,
        null,
        [[1, 10]]
      )
    })
  )
  return _deprecatedFunctions.apply(this, arguments)
}

function generateApplicationArtifact(_x8, _x9, _x10, _x11, _x12, _x13, _x14) {
  return _generateApplicationArtifact.apply(this, arguments)
}

function _generateApplicationArtifact() {
  _generateApplicationArtifact = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee6(
      cwd,
      apm,
      outputPath,
      module,
      deployArtifacts,
      web3,
      reporter
    ) {
      var artifact
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch ((_context6.prev = _context6.next)) {
            case 0:
              // Set appName, path & roles
              artifact = Object.assign({}, module) // Set `appId`

              artifact.appId = namehash.hash(artifact.appName) // Set environments

              _context6.next = 4
              return getEnvironments(cwd)

            case 4:
              artifact.environments = _context6.sent
              _context6.next = 7
              return getContractAbi(cwd, artifact.path)

            case 7:
              artifact.abi = _context6.sent

              if (deployArtifacts) {
                artifact.deployment = deployArtifacts
                artifact.deployment.flattenedCode = './'.concat(SOLIDITY_FILE)
              } // Analyse contract functions and returns an array
              // > [{ sig: 'transfer(address)', role: 'X_ROLE', notice: 'Transfers..'}]

              _context6.next = 11
              return extract(path.resolve(cwd, artifact.path))

            case 11:
              artifact.functions = _context6.sent
              decorateFunctionsWithAbi(artifact.functions, artifact.abi, web3) // Consult old (major) version's artifacts and return an array
              // of deprecated functions per version
              // > "deprecatedFunctions": { "1.0.0": [{}], "2.0.0": [{}] }

              _context6.next = 15
              return deprecatedFunctions(apm, artifact, web3, reporter)

            case 15:
              artifact.deprecatedFunctions = _context6.sent

              if (artifact.roles) {
                getRoles(artifact.roles)
              } // Save artifact

              _context6.next = 19
              return writeJson(
                path.resolve(outputPath, ARTIFACT_FILE),
                artifact,
                {
                  spaces: '\t',
                }
              )

            case 19:
              return _context6.abrupt('return', artifact)

            case 20:
            case 'end':
              return _context6.stop()
          }
        }
      }, _callee6)
    })
  )
  return _generateApplicationArtifact.apply(this, arguments)
}

function generateFlattenedCode(_x15, _x16) {
  return _generateFlattenedCode.apply(this, arguments)
} // Sanity check artifact.json

function _generateFlattenedCode() {
  _generateFlattenedCode = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee7(dir, sourcePath) {
      var flattenedCode
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch ((_context7.prev = _context7.next)) {
            case 0:
              _context7.next = 2
              return flatten([sourcePath])

            case 2:
              flattenedCode = _context7.sent
              fs.writeFileSync(path.resolve(dir, SOLIDITY_FILE), flattenedCode)

            case 4:
            case 'end':
              return _context7.stop()
          }
        }
      }, _callee7)
    })
  )
  return _generateFlattenedCode.apply(this, arguments)
}

function sanityCheck(_x17, _x18, _x19, _x20) {
  return _sanityCheck.apply(this, arguments)
}

function _sanityCheck() {
  _sanityCheck = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee8(
      cwd,
      newRoles,
      newContractPath,
      oldArtifact
    ) {
      var roles,
        environments,
        abi,
        path,
        newContractRoles,
        newContractEnvironments,
        newContractAbi
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch ((_context8.prev = _context8.next)) {
            case 0:
              ;(roles = oldArtifact.roles),
                (environments = oldArtifact.environments),
                (abi = oldArtifact.abi),
                (path = oldArtifact.path)
              _context8.next = 3
              return getRoles(newRoles)

            case 3:
              newContractRoles = _context8.sent
              _context8.next = 6
              return getEnvironments(cwd)

            case 6:
              newContractEnvironments = _context8.sent
              _context8.next = 9
              return getContractAbi(cwd, newContractPath)

            case 9:
              newContractAbi = _context8.sent
              return _context8.abrupt(
                'return',
                JSON.stringify(newContractRoles) !== JSON.stringify(roles) ||
                  JSON.stringify(newContractEnvironments) !==
                    JSON.stringify(environments) ||
                  JSON.stringify(newContractAbi) !== JSON.stringify(abi) ||
                  newContractPath !== path
              )

            case 11:
            case 'end':
              return _context8.stop()
          }
        }
      }, _callee8)
    })
  )
  return _sanityCheck.apply(this, arguments)
}

function copyCurrentApplicationArtifacts(
  _x21,
  _x22,
  _x23,
  _x24,
  _x25,
  _x26,
  _x27
) {
  return _copyCurrentApplicationArtifacts.apply(this, arguments)
}

function _copyCurrentApplicationArtifacts() {
  _copyCurrentApplicationArtifacts = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee11(
      cwd,
      outputPath,
      apm,
      repo,
      newVersion,
      roles,
      contractPath
    ) {
      var copyingFiles,
        content,
        uri,
        copy,
        updateArtifactVersion,
        evaluateFile,
        copyArray
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch ((_context11.prev = _context11.next)) {
            case 0:
              copyingFiles = [ARTIFACT_FILE, SOLIDITY_FILE]
              content = repo.content
              uri = ''.concat(content.provider, ':').concat(content.location)
              _context11.next = 5
              return Promise.all(
                copyingFiles.map(
                  /* #__PURE__ */
                  (function() {
                    var _ref2 = _asyncToGenerator(
                      /* #__PURE__ */
                      regeneratorRuntime.mark(function _callee9(file) {
                        return regeneratorRuntime.wrap(
                          function _callee9$(_context9) {
                            while (1) {
                              switch ((_context9.prev = _context9.next)) {
                                case 0:
                                  _context9.prev = 0
                                  _context9.t0 = path.resolve(outputPath, file)
                                  _context9.next = 4
                                  return apm.getFile(uri, file)

                                case 4:
                                  _context9.t1 = _context9.sent
                                  _context9.t2 = file
                                  return _context9.abrupt('return', {
                                    filePath: _context9.t0,
                                    fileContent: _context9.t1,
                                    fileName: _context9.t2,
                                  })

                                case 9:
                                  _context9.prev = 9
                                  _context9.t3 = _context9['catch'](0)

                                  if (!(file === ARTIFACT_FILE)) {
                                    _context9.next = 13
                                    break
                                  }

                                  throw _context9.t3

                                case 13:
                                case 'end':
                                  return _context9.stop()
                              }
                            }
                          },
                          _callee9,
                          null,
                          [[0, 9]]
                        )
                      })
                    )

                    return function(_x30) {
                      return _ref2.apply(this, arguments)
                    }
                  })()
                )
              )

            case 5:
              copy = _context11.sent

              updateArtifactVersion = function updateArtifactVersion(
                file,
                version
              ) {
                var newContent = JSON.parse(file.fileContent)
                newContent.version = version
                return _objectSpread({}, file, {
                  fileContent: JSON.stringify(newContent, null, 2),
                })
              }

              evaluateFile =
                /* #__PURE__ */
                (function() {
                  var _ref3 = _asyncToGenerator(
                    /* #__PURE__ */
                    regeneratorRuntime.mark(function _callee10(file) {
                      var rebuild
                      return regeneratorRuntime.wrap(function _callee10$(
                        _context10
                      ) {
                        while (1) {
                          switch ((_context10.prev = _context10.next)) {
                            case 0:
                              if (!(file.fileName === ARTIFACT_FILE)) {
                                _context10.next = 9
                                break
                              }

                              _context10.next = 3
                              return sanityCheck(
                                cwd,
                                roles,
                                contractPath,
                                JSON.parse(file.fileContent)
                              )

                            case 3:
                              rebuild = _context10.sent

                              if (!rebuild) {
                                _context10.next = 8
                                break
                              }

                              throw new Error('Artifact mismatch')

                            case 8:
                              return _context10.abrupt(
                                'return',
                                updateArtifactVersion(file, newVersion)
                              )

                            case 9:
                              return _context10.abrupt('return', file)

                            case 10:
                            case 'end':
                              return _context10.stop()
                          }
                        }
                      },
                      _callee10)
                    })
                  )

                  return function evaluateFile(_x31) {
                    return _ref3.apply(this, arguments)
                  }
                })()

              _context11.next = 10
              return Promise.all(
                copy
                  .filter(function(item) {
                    return item
                  })
                  .map(function(file) {
                    return evaluateFile(file)
                  })
              )

            case 10:
              copyArray = _context11.sent
              copyArray.forEach(function(_ref4) {
                var fileName = _ref4.fileName
                var filePath = _ref4.filePath
                var fileContent = _ref4.fileContent
                return fs.writeFileSync(filePath, fileContent)
              })

            case 12:
            case 'end':
              return _context11.stop()
          }
        }
      }, _callee11)
    })
  )
  return _copyCurrentApplicationArtifacts.apply(this, arguments)
}

module.exports = {
  POSITIVE_ANSWERS: POSITIVE_ANSWERS,
  NEGATIVE_ANSWERS: NEGATIVE_ANSWERS,
  ANSWERS: ANSWERS,
  SOLIDITY_FILE: SOLIDITY_FILE,
  getMajor: getMajor,
  generateApplicationArtifact: generateApplicationArtifact,
  generateFlattenedCode: generateFlattenedCode,
  sanityCheck: sanityCheck,
  copyCurrentApplicationArtifacts: copyCurrentApplicationArtifacts,
}
// # sourceMappingURL=generate-artifact.js.map
