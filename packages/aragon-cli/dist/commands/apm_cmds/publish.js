'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.symbol.description')

require('core-js/modules/es.symbol.iterator')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.index-of')

require('core-js/modules/es.array.is-array')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.array.join')

require('core-js/modules/es.array.map')

require('core-js/modules/es.date.to-string')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.iterator')

require('core-js/modules/es.string.split')

require('core-js/modules/es.string.bold')

require('core-js/modules/web.dom-collections.iterator')

require('regenerator-runtime/runtime')

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  )
}

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance')
}

function _iterableToArrayLimit(arr, i) {
  if (
    !(
      Symbol.iterator in Object(arr) ||
      Object.prototype.toString.call(arr) === '[object Arguments]'
    )
  ) {
    return
  }
  var _arr = []
  var _n = true
  var _d = false
  var _e = undefined
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value)
      if (i && _arr.length === i) break
    }
  } catch (err) {
    _d = true
    _e = err
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']()
    } finally {
      if (_d) throw _e
    }
  }
  return _arr
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr
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

var _require = require('../../helpers/web3-fallback')
var ensureWeb3 = _require.ensureWeb3

var tmp = require('tmp-promise')

var path = require('path')

var _require2 = require('fs-extra')
var readJson = _require2.readJson
var writeJson = _require2.writeJson
var pathExistsSync = _require2.pathExistsSync

var APM = require('@aragon/apm')

var semver = require('semver')

var TaskList = require('listr')

var taskInput = require('listr-input')

var inquirer = require('inquirer')

var chalk = require('chalk')

var _require3 = require('../../util')
var findProjectRoot = _require3.findProjectRoot
var runScriptTask = _require3.runScriptTask
var ZERO_ADDRESS = _require3.ZERO_ADDRESS

var _require4 = require('../../helpers/truffle-runner')
var compileContracts = _require4.compileContracts

var web3Utils = require('web3-utils')

var deploy = require('../deploy')

var startIPFS = require('../ipfs_cmds/start')

var propagateIPFS = require('../ipfs_cmds/propagate')

var execTask = require('../dao_cmds/utils/execHandler').task

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

var _require5 = require('./util/preprare-files')
var prepareFilesForPublishing = _require5.prepareFilesForPublishing
var MANIFEST_FILE = _require5.MANIFEST_FILE
var ARTIFACT_FILE = _require5.ARTIFACT_FILE

var _require6 = require('./util/generate-artifact')
var getMajor = _require6.getMajor
var sanityCheck = _require6.sanityCheck
var generateApplicationArtifact = _require6.generateApplicationArtifact
var generateFlattenedCode = _require6.generateFlattenedCode
var copyCurrentApplicationArtifacts = _require6.copyCurrentApplicationArtifacts
var SOLIDITY_FILE = _require6.SOLIDITY_FILE
var POSITIVE_ANSWERS = _require6.POSITIVE_ANSWERS
var ANSWERS = _require6.ANSWERS

exports.command = 'publish <bump> [contract]'
exports.describe = 'Publish a new version of the application'

exports.builder = function(yargs) {
  return deploy
    .builder(yargs) // inherit deploy options
    .positional('bump', {
      description: 'Type of bump (major, minor or patch) or version number',
      type: 'string',
    })
    .positional('contract', {
      description:
        "The address or name of the contract to publish in this version. If it isn't provided, it will default to the current version's contract.",
      type: 'string',
    })
    .option('init', {
      description: 'Arguments to be passed to contract constructor',
      array: true,
      default: [],
    })
    .option('only-artifacts', {
      description: 'Whether just generate artifacts file without publishing',
      default: false,
      boolean: true,
    })
    .option('provider', {
      description: 'The aragonPM storage provider to publish files to',
      default: 'ipfs',
      choices: ['ipfs'],
    })
    .option('reuse', {
      description:
        'Whether to reuse the previous version contract and skip deployment on non-major versions',
      default: false,
      boolean: true,
    })
    .option('files', {
      description:
        'Path(s) to directories containing files to publish. Specify multiple times to include multiple files.',
      default: ['.'],
      array: true,
    })
    .option('ignore', {
      description:
        'A gitignore pattern of files to ignore. Specify multiple times to add multiple patterns.',
      array: true,
      default: ['node_modules'],
    })
    .option('ipfs-check', {
      description: 'Whether to have publish start IPFS if not started',
      boolean: true,
      default: true,
    })
    .option('publish-dir', {
      description:
        'Temporary directory where files will be copied before publishing. Defaults to temp dir.',
      default: null,
    })
    .option('only-content', {
      description:
        'Whether to skip contract compilation, deployment and contract artifact generation',
      default: false,
      boolean: true,
    })
    .option('build', {
      description:
        'Whether publish should try to build the app before publishing, running the script specified in --build-script',
      default: true,
      boolean: true,
    })
    .option('build-script', {
      description: 'The npm script that will be run when building the app',
      default: 'build',
    })
    .option('prepublish', {
      description:
        'Whether publish should run prepublish script specified in --prepublish-script before publishing',
      default: true,
      boolean: true,
    })
    .option('prepublish-script', {
      description: 'The npm script that will be run before publishing the app',
      default: 'prepublishOnly',
    })
    .option('http', {
      description: 'URL for where your app is served e.g. localhost:1234',
      default: null,
    })
    .option('http-served-from', {
      description:
        'Directory where your files is being served from e.g. ./dist',
      default: null,
    })
    .option('propagate-content', {
      description: 'Whether to propagate the content once published',
      boolean: true,
      default: true,
    })
    .option('skip-confirmation', {
      description: 'Whether to skip the confirmation step',
      boolean: true,
      default: false,
    })
}

exports.runSetupTask = function(_ref) {
  var reporter = _ref.reporter
  var gasPrice = _ref.gasPrice
  var cwd = _ref.cwd
  var web3 = _ref.web3
  var network = _ref.network
  var module = _ref.module
  var apmOptions = _ref.apm
  var silent = _ref.silent
  var debug = _ref.debug
  var prepublish = _ref.prepublish
  var prepublishScript = _ref.prepublishScript
  var build = _ref.build
  var buildScript = _ref.buildScript
  var bump = _ref.bump
  var contract = _ref.contract
  var init = _ref.init
  var reuse = _ref.reuse
  var onlyContent = _ref.onlyContent
  var onlyArtifacts = _ref.onlyArtifacts
  var ipfsCheck = _ref.ipfsCheck
  var http = _ref.http

  if (onlyContent) {
    contract = ZERO_ADDRESS
  }

  apmOptions.ensRegistryAddress = apmOptions['ens-registry']
  var apm = APM(web3, apmOptions)
  return new TaskList(
    [
      {
        title: 'Running prepublish script',
        enabled: function enabled() {
          return prepublish
        },
        task: (function() {
          var _task2 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee(ctx, _task) {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      return _context.abrupt(
                        'return',
                        runScriptTask(_task, prepublishScript)
                      )

                    case 1:
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
        title: 'Check IPFS',
        enabled: function enabled() {
          return !http && ipfsCheck
        },
        task: function task() {
          return startIPFS.task({
            apmOptions: apmOptions,
          })
        },
      },
      {
        title: 'Applying version bump ('.concat(bump, ')'),
        task: (function() {
          var _task3 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee2(ctx) {
              var isValid, ipfsTimeout
              return regeneratorRuntime.wrap(
                function _callee2$(_context2) {
                  while (1) {
                    switch ((_context2.prev = _context2.next)) {
                      case 0:
                        isValid = true
                        _context2.prev = 1
                        ipfsTimeout = 1000 * 60 * 5 // 5min

                        reporter.info(
                          'Fetching latest version from aragonPM...'
                        )
                        _context2.next = 6
                        return apm.getLatestVersion(module.appName, ipfsTimeout)

                      case 6:
                        ctx.initialRepo = _context2.sent
                        ctx.initialVersion = ctx.initialRepo.version
                        ctx.version = semver.valid(bump)
                          ? semver.valid(bump)
                          : semver.inc(ctx.initialVersion, bump)
                        _context2.next = 11
                        return apm.isValidBump(
                          module.appName,
                          ctx.initialVersion,
                          ctx.version
                        )

                      case 11:
                        isValid = _context2.sent

                        if (isValid) {
                          _context2.next = 14
                          break
                        }

                        throw new Error(
                          "Version bump is not valid, you have to respect APM's versioning policy. Check the version upgrade rules in the documentation: https://hack.aragon.org/docs/apm-ref.html#version-upgrade-rules"
                        )

                      case 14:
                        ctx.shouldDeployContract =
                          getMajor(ctx.initialVersion) !== getMajor(ctx.version)
                        _context2.next = 25
                        break

                      case 17:
                        _context2.prev = 17
                        _context2.t0 = _context2['catch'](1)

                        if (
                          !(
                            _context2.t0.message.indexOf(
                              'Invalid content URI'
                            ) === 0
                          )
                        ) {
                          _context2.next = 21
                          break
                        }

                        return _context2.abrupt('return')

                      case 21:
                        // Repo doesn't exist yet, deploy the first version
                        ctx.version = semver.valid(bump)
                          ? semver.valid(bump)
                          : semver.inc('0.0.0', bump) // All valid initial versions are a version bump from 0.0.0

                        if (
                          !(
                            apm.validInitialVersions.indexOf(ctx.version) === -1
                          )
                        ) {
                          _context2.next = 24
                          break
                        }

                        throw new Error(
                          'Invalid initial version  ('.concat(
                            ctx.version,
                            '). It can only be 0.0.1, 0.1.0 or 1.0.0.'
                          )
                        )

                      case 24:
                        ctx.shouldDeployContract = true // assume first version should deploy a contract

                      case 25:
                      case 'end':
                        return _context2.stop()
                    }
                  }
                },
                _callee2,
                null,
                [[1, 17]]
              )
            })
          )

          function task(_x3) {
            return _task3.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Building frontend',
        enabled: function enabled() {
          return build && !http
        },
        task: (function() {
          var _task5 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee3(ctx, _task4) {
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch ((_context3.prev = _context3.next)) {
                    case 0:
                      return _context3.abrupt(
                        'return',
                        runScriptTask(_task4, buildScript)
                      )

                    case 1:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3)
            })
          )

          function task(_x4, _x5) {
            return _task5.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Compile contracts',
        enabled: function enabled() {
          return !onlyContent && web3Utils.isAddress(contract)
        },
        task: (function() {
          var _task6 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee4() {
              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch ((_context4.prev = _context4.next)) {
                    case 0:
                      return _context4.abrupt('return', compileContracts())

                    case 1:
                    case 'end':
                      return _context4.stop()
                  }
                }
              }, _callee4)
            })
          )

          function task() {
            return _task6.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Deploy contract',
        enabled: function enabled(ctx) {
          return (
            !onlyContent &&
            ((contract && !web3Utils.isAddress(contract)) ||
              (!contract && ctx.shouldDeployContract && !reuse))
          )
        },
        task: (function() {
          var _task7 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee5(ctx) {
              var deployTaskParams
              return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                  switch ((_context5.prev = _context5.next)) {
                    case 0:
                      deployTaskParams = {
                        contract: contract,
                        init: init,
                        gasPrice: gasPrice,
                        network: network,
                        cwd: cwd,
                        web3: web3,
                        apmOptions: apmOptions,
                      }
                      return _context5.abrupt(
                        'return',
                        deploy.task(deployTaskParams)
                      )

                    case 2:
                    case 'end':
                      return _context5.stop()
                  }
                }
              }, _callee5)
            })
          )

          function task(_x6) {
            return _task7.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Determine contract address for version',
        enabled: function enabled() {
          return !onlyArtifacts
        },
        task: (function() {
          var _task9 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee6(ctx, _task8) {
              var _ref2, contractAddress

              return regeneratorRuntime.wrap(
                function _callee6$(_context6) {
                  while (1) {
                    switch ((_context6.prev = _context6.next)) {
                      case 0:
                        if (web3Utils.isAddress(contract)) {
                          ctx.contract = contract
                        } // Check if we can fall back to a previous contract address

                        if (
                          !(
                            !ctx.contract &&
                            apm.validInitialVersions.indexOf(ctx.version) === -1
                          )
                        ) {
                          _context6.next = 15
                          break
                        }

                        _task8.output =
                          'No contract address provided, using previous one'
                        _context6.prev = 3
                        _context6.next = 6
                        return apm.getLatestVersion(module.appName)

                      case 6:
                        _ref2 = _context6.sent
                        contractAddress = _ref2.contractAddress
                        ctx.contract = contractAddress
                        return _context6.abrupt(
                          'return',
                          'Using '.concat(ctx.contract)
                        )

                      case 12:
                        _context6.prev = 12
                        _context6.t0 = _context6['catch'](3)
                        throw new Error('Could not determine previous contract')

                      case 15:
                        if (ctx.contract) {
                          _context6.next = 17
                          break
                        }

                        throw new Error(
                          'No contract address supplied for initial version'
                        )

                      case 17:
                        return _context6.abrupt(
                          'return',
                          'Using '.concat(contract)
                        )

                      case 18:
                      case 'end':
                        return _context6.stop()
                    }
                  }
                },
                _callee6,
                null,
                [[3, 12]]
              )
            })
          )

          function task(_x7, _x8) {
            return _task9.apply(this, arguments)
          }

          return task
        })(),
      },
    ],
    listrOpts(silent, debug)
  )
}

exports.runPrepareForPublishTask = function(_ref3) {
  var reporter = _ref3.reporter
  var cwd = _ref3.cwd
  var web3 = _ref3.web3
  var network = _ref3.network
  var module = _ref3.module
  var apmOptions = _ref3.apm
  var silent = _ref3.silent
  var debug = _ref3.debug
  var publishDir = _ref3.publishDir
  var files = _ref3.files
  var ignore = _ref3.ignore
  var httpServedFrom = _ref3.httpServedFrom
  var provider = _ref3.provider
  var onlyArtifacts = _ref3.onlyArtifacts
  var onlyContent = _ref3.onlyContent
  var http = _ref3.http
  var initialRepo = _ref3.initialRepo
  var initialVersion = _ref3.initialVersion
  var version = _ref3.version
  var contractAddress = _ref3.contractAddress
  var deployArtifacts = _ref3.deployArtifacts
  apmOptions.ensRegistryAddress = apmOptions['ens-registry']
  var apm = APM(web3, apmOptions)
  return new TaskList(
    [
      {
        title: 'Prepare files for publishing',
        enabled: function enabled() {
          return !http
        },
        task: (function() {
          var _task11 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee7(ctx, _task10) {
              var _ref4, tmpDir

              return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                  switch ((_context7.prev = _context7.next)) {
                    case 0:
                      if (publishDir) {
                        _context7.next = 6
                        break
                      }

                      _context7.next = 3
                      return tmp.dir()

                    case 3:
                      _ref4 = _context7.sent
                      tmpDir = _ref4.path
                      publishDir = tmpDir

                    case 6:
                      _context7.next = 8
                      return prepareFilesForPublishing(
                        publishDir,
                        files,
                        ignore
                      )

                    case 8:
                      ctx.pathToPublish = publishDir
                      return _context7.abrupt(
                        'return',
                        'Files copied to temporary directory: '.concat(
                          ctx.pathToPublish
                        )
                      )

                    case 10:
                    case 'end':
                      return _context7.stop()
                  }
                }
              }, _callee7)
            })
          )

          function task(_x9, _x10) {
            return _task11.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title:
          'Check for --http-served-from argument and copy manifest.json to destination',
        enabled: function enabled() {
          return http
        },
        task: (function() {
          var _task13 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee8(ctx, _task12) {
              var projectRoot, manifestOrigin, manifestDst, manifest
              return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                  switch ((_context8.prev = _context8.next)) {
                    case 0:
                      if (httpServedFrom) {
                        _context8.next = 2
                        break
                      }

                      throw new Error(
                        'You need to provide --http-served-from argument'
                      )

                    case 2:
                      projectRoot = findProjectRoot()
                      manifestOrigin = path.resolve(projectRoot, MANIFEST_FILE)
                      manifestDst = path.resolve(httpServedFrom, MANIFEST_FILE)

                      if (
                        !(
                          !pathExistsSync(manifestDst) &&
                          pathExistsSync(manifestOrigin)
                        )
                      ) {
                        _context8.next = 13
                        break
                      }

                      _context8.next = 8
                      return readJson(manifestOrigin)

                    case 8:
                      manifest = _context8.sent
                      manifest.start_url = path.basename(manifest.start_url)
                      manifest.script = path.basename(manifest.script)
                      _context8.next = 13
                      return writeJson(manifestDst, manifest)

                    case 13:
                      ctx.pathToPublish = httpServedFrom

                    case 14:
                    case 'end':
                      return _context8.stop()
                  }
                }
              }, _callee8)
            })
          )

          function task(_x11, _x12) {
            return _task13.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Generate application artifact',
        skip: function skip() {
          return onlyContent && !module.path
        },
        task: (function() {
          var _task15 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee13(ctx, _task14) {
              var dir,
                contractPath,
                roles,
                invokeArtifactGeneration,
                _invokeArtifactGeneration,
                existingArtifactPath,
                existingArtifact,
                rebuild

              return regeneratorRuntime.wrap(
                function _callee13$(_context13) {
                  while (1) {
                    switch ((_context13.prev = _context13.next)) {
                      case 0:
                        _invokeArtifactGeneration = function _ref6() {
                          _invokeArtifactGeneration = _asyncToGenerator(
                            /* #__PURE__ */
                            regeneratorRuntime.mark(function _callee12(answer) {
                              return regeneratorRuntime.wrap(
                                function _callee12$(_context12) {
                                  while (1) {
                                    switch (
                                      (_context12.prev = _context12.next)
                                    ) {
                                      case 0:
                                        if (
                                          !(
                                            POSITIVE_ANSWERS.indexOf(answer) >
                                            -1
                                          )
                                        ) {
                                          _context12.next = 6
                                          break
                                        }

                                        _context12.next = 3
                                        return generateApplicationArtifact(
                                          cwd,
                                          apm,
                                          dir,
                                          module,
                                          deployArtifacts,
                                          web3,
                                          reporter
                                        )

                                      case 3:
                                        _context12.next = 5
                                        return generateFlattenedCode(
                                          dir,
                                          contractPath
                                        )

                                      case 5:
                                        return _context12.abrupt(
                                          'return',
                                          'Saved artifact in '
                                            .concat(dir, '/')
                                            .concat(ARTIFACT_FILE)
                                        )

                                      case 6:
                                        throw new Error(
                                          'Aborting publication...'
                                        )

                                      case 7:
                                      case 'end':
                                        return _context12.stop()
                                    }
                                  }
                                },
                                _callee12
                              )
                            })
                          )
                          return _invokeArtifactGeneration.apply(
                            this,
                            arguments
                          )
                        }

                        invokeArtifactGeneration = function _ref5(_x15) {
                          return _invokeArtifactGeneration.apply(
                            this,
                            arguments
                          )
                        }

                        dir = onlyArtifacts ? cwd : ctx.pathToPublish
                        contractPath = module.path
                        roles = module.roles // TODO: (Gabi) Use inquier to handle confirmation

                        if (
                          !pathExistsSync(
                            ''.concat(dir, '/').concat(ARTIFACT_FILE)
                          )
                        ) {
                          _context13.next = 18
                          break
                        }

                        existingArtifactPath = path.resolve(dir, ARTIFACT_FILE)
                        _context13.next = 9
                        return readJson(existingArtifactPath)

                      case 9:
                        existingArtifact = _context13.sent
                        _context13.next = 12
                        return sanityCheck(
                          cwd,
                          roles,
                          contractPath,
                          existingArtifact
                        )

                      case 12:
                        rebuild = _context13.sent

                        if (!rebuild) {
                          _context13.next = 17
                          break
                        }

                        return _context13.abrupt(
                          'return',
                          taskInput(
                            "Couldn't reuse artifact due to mismatches, regenerate now? [y]es/[a]bort",
                            {
                              validate: function validate(value) {
                                return ANSWERS.indexOf(value) > -1
                              },
                              done: (function() {
                                var _done = _asyncToGenerator(
                                  /* #__PURE__ */
                                  regeneratorRuntime.mark(function _callee9(
                                    answer
                                  ) {
                                    return regeneratorRuntime.wrap(
                                      function _callee9$(_context9) {
                                        while (1) {
                                          switch (
                                            (_context9.prev = _context9.next)
                                          ) {
                                            case 0:
                                              return _context9.abrupt(
                                                'return',
                                                invokeArtifactGeneration(answer)
                                              )

                                            case 1:
                                            case 'end':
                                              return _context9.stop()
                                          }
                                        }
                                      },
                                      _callee9
                                    )
                                  })
                                )

                                function done(_x16) {
                                  return _done.apply(this, arguments)
                                }

                                return done
                              })(),
                            }
                          )
                        )

                      case 17:
                        return _context13.abrupt(
                          'return',
                          _task14.skip('Using existing artifact')
                        )

                      case 18:
                        if (
                          !(
                            onlyContent &
                            (apm.validInitialVersions.indexOf(version) === -1)
                          )
                        ) {
                          _context13.next = 36
                          break
                        }

                        _context13.prev = 19
                        _task14.output =
                          'Fetching artifacts from previous version'
                        _context13.next = 23
                        return copyCurrentApplicationArtifacts(
                          cwd,
                          dir,
                          apm,
                          initialRepo,
                          version,
                          roles,
                          contractPath
                        )

                      case 23:
                        if (
                          pathExistsSync(
                            ''.concat(dir, '/').concat(SOLIDITY_FILE)
                          )
                        ) {
                          _context13.next = 26
                          break
                        }

                        _context13.next = 26
                        return generateFlattenedCode(dir, contractPath)

                      case 26:
                        return _context13.abrupt(
                          'return',
                          _task14.skip(
                            'Using artifacts from v'.concat(initialVersion)
                          )
                        )

                      case 29:
                        _context13.prev = 29
                        _context13.t0 = _context13['catch'](19)

                        if (!(_context13.t0.message === 'Artifact mismatch')) {
                          _context13.next = 35
                          break
                        }

                        return _context13.abrupt(
                          'return',
                          taskInput(
                            "Couldn't reuse existing artifact due to mismatches, regenerate now? [y]es/[a]bort",
                            {
                              validate: function validate(value) {
                                return ANSWERS.indexOf(value) > -1
                              },
                              done: (function() {
                                var _done2 = _asyncToGenerator(
                                  /* #__PURE__ */
                                  regeneratorRuntime.mark(function _callee10(
                                    answer
                                  ) {
                                    return regeneratorRuntime.wrap(
                                      function _callee10$(_context10) {
                                        while (1) {
                                          switch (
                                            (_context10.prev = _context10.next)
                                          ) {
                                            case 0:
                                              return _context10.abrupt(
                                                'return',
                                                invokeArtifactGeneration(answer)
                                              )

                                            case 1:
                                            case 'end':
                                              return _context10.stop()
                                          }
                                        }
                                      },
                                      _callee10
                                    )
                                  })
                                )

                                function done(_x17) {
                                  return _done2.apply(this, arguments)
                                }

                                return done
                              })(),
                            }
                          )
                        )

                      case 35:
                        return _context13.abrupt(
                          'return',
                          taskInput(
                            "Couldn't fetch current artifact version to copy it. Please make sure your IPFS or HTTP server are running. Otherwise, generate now? [y]es/[a]bort",
                            {
                              validate: function validate(value) {
                                return ANSWERS.indexOf(value) > -1
                              },
                              done: (function() {
                                var _done3 = _asyncToGenerator(
                                  /* #__PURE__ */
                                  regeneratorRuntime.mark(function _callee11(
                                    answer
                                  ) {
                                    return regeneratorRuntime.wrap(
                                      function _callee11$(_context11) {
                                        while (1) {
                                          switch (
                                            (_context11.prev = _context11.next)
                                          ) {
                                            case 0:
                                              return _context11.abrupt(
                                                'return',
                                                invokeArtifactGeneration(answer)
                                              )

                                            case 1:
                                            case 'end':
                                              return _context11.stop()
                                          }
                                        }
                                      },
                                      _callee11
                                    )
                                  })
                                )

                                function done(_x18) {
                                  return _done3.apply(this, arguments)
                                }

                                return done
                              })(),
                            }
                          )
                        )

                      case 36:
                        _context13.next = 38
                        return invokeArtifactGeneration('yes')

                      case 38:
                        return _context13.abrupt(
                          'return',
                          'Saved artifact in '.concat(dir, '/artifact.json')
                        )

                      case 39:
                      case 'end':
                        return _context13.stop()
                    }
                  }
                },
                _callee13,
                null,
                [[19, 29]]
              )
            })
          )

          function task(_x13, _x14) {
            return _task15.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Publish intent',
        task: (function() {
          var _task17 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee14(ctx, _task16) {
              var accounts, from
              return regeneratorRuntime.wrap(function _callee14$(_context14) {
                while (1) {
                  switch ((_context14.prev = _context14.next)) {
                    case 0:
                      ctx.contractInstance = null // clean up deploy sub-command artifacts

                      _context14.next = 3
                      return web3.eth.getAccounts()

                    case 3:
                      accounts = _context14.sent
                      from = accounts[0]
                      _context14.next = 7
                      return apm.publishVersionIntent(
                        from,
                        module.appName,
                        version,
                        http ? 'http' : provider,
                        http || ctx.pathToPublish,
                        contractAddress
                      )

                    case 7:
                      ctx.intent = _context14.sent

                    case 8:
                    case 'end':
                      return _context14.stop()
                  }
                }
              }, _callee14)
            })
          )

          function task(_x19, _x20) {
            return _task17.apply(this, arguments)
          }

          return task
        })(),
      },
    ],
    listrOpts(silent, debug)
  )
}

exports.runPublishTask = function(_ref7) {
  var reporter = _ref7.reporter
  var gasPrice = _ref7.gasPrice
  var web3 = _ref7.web3
  var wsProvider = _ref7.wsProvider
  var module = _ref7.module
  var apmOptions = _ref7.apm
  var silent = _ref7.silent
  var debug = _ref7.debug
  var onlyArtifacts = _ref7.onlyArtifacts
  var onlyContent = _ref7.onlyContent
  var dao = _ref7.dao
  var proxyAddress = _ref7.proxyAddress
  var methodName = _ref7.methodName
  var params = _ref7.params
  apmOptions.ensRegistryAddress = apmOptions['ens-registry']
  return new TaskList(
    [
      {
        title: 'Publish '.concat(module.appName),
        enabled: function enabled() {
          return !onlyArtifacts
        },
        task: (function() {
          var _task19 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee15(ctx, _task18) {
              var getTransactionPath
              return regeneratorRuntime.wrap(
                function _callee15$(_context15) {
                  while (1) {
                    switch ((_context15.prev = _context15.next)) {
                      case 0:
                        _context15.prev = 0

                        getTransactionPath = function getTransactionPath(
                          wrapper
                        ) {
                          return wrapper.getTransactionPath(
                            proxyAddress,
                            methodName,
                            params
                          )
                        }

                        return _context15.abrupt(
                          'return',
                          execTask(dao, getTransactionPath, {
                            ipfsCheck: false,
                            reporter: reporter,
                            gasPrice: gasPrice,
                            apm: apmOptions,
                            web3: web3,
                            wsProvider: wsProvider,
                          })
                        )

                      case 5:
                        _context15.prev = 5
                        _context15.t0 = _context15['catch'](0)
                        throw _context15.t0

                      case 8:
                      case 'end':
                        return _context15.stop()
                    }
                  }
                },
                _callee15,
                null,
                [[0, 5]]
              )
            })
          )

          function task(_x21, _x22) {
            return _task19.apply(this, arguments)
          }

          return task
        })(),
      },
    ],
    listrOpts(silent, debug)
  )
}

exports.handler =
  /* #__PURE__ */
  (function() {
    var _ref9 = _asyncToGenerator(
      /* #__PURE__ */
      regeneratorRuntime.mark(function _callee16(_ref8) {
        var reporter,
          gasPrice,
          cwd,
          web3,
          network,
          wsProvider,
          module,
          apmOptions,
          silent,
          debug,
          bump,
          contract,
          onlyArtifacts,
          reuse,
          provider,
          files,
          ignore,
          ipfsCheck,
          publishDir,
          init,
          onlyContent,
          build,
          buildScript,
          prepublish,
          prepublishScript,
          http,
          httpServedFrom,
          propagateContent,
          skipConfirmation,
          _ref10,
          initialRepo,
          initialVersion,
          version,
          contractAddress,
          deployArtifacts,
          _ref11,
          pathToPublish,
          intent,
          appName,
          dao,
          proxyAddress,
          methodName,
          params,
          contentURI,
          _contentURI$split,
          _contentURI$split2,
          contentProvier,
          contentLocation,
          _ref12,
          confirmation,
          _ref13,
          receipt,
          transactionPath,
          transactionHash,
          status,
          logVersion,
          _ref14,
          _confirmation,
          propagateTask,
          _ref15,
          CIDs,
          result

        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch ((_context16.prev = _context16.next)) {
              case 0:
                ;(reporter = _ref8.reporter),
                  (gasPrice = _ref8.gasPrice),
                  (cwd = _ref8.cwd),
                  (web3 = _ref8.web3),
                  (network = _ref8.network),
                  (wsProvider = _ref8.wsProvider),
                  (module = _ref8.module),
                  (apmOptions = _ref8.apm),
                  (silent = _ref8.silent),
                  (debug = _ref8.debug),
                  (bump = _ref8.bump),
                  (contract = _ref8.contract),
                  (onlyArtifacts = _ref8.onlyArtifacts),
                  (reuse = _ref8.reuse),
                  (provider = _ref8.provider),
                  (files = _ref8.files),
                  (ignore = _ref8.ignore),
                  (ipfsCheck = _ref8.ipfsCheck),
                  (publishDir = _ref8.publishDir),
                  (init = _ref8.init),
                  (onlyContent = _ref8.onlyContent),
                  (build = _ref8.build),
                  (buildScript = _ref8.buildScript),
                  (prepublish = _ref8.prepublish),
                  (prepublishScript = _ref8.prepublishScript),
                  (http = _ref8.http),
                  (httpServedFrom = _ref8.httpServedFrom),
                  (propagateContent = _ref8.propagateContent),
                  (skipConfirmation = _ref8.skipConfirmation)
                _context16.t0 = web3

                if (_context16.t0) {
                  _context16.next = 6
                  break
                }

                _context16.next = 5
                return ensureWeb3(network)

              case 5:
                _context16.t0 = _context16.sent

              case 6:
                web3 = _context16.t0
                _context16.next = 9
                return exports
                  .runSetupTask({
                    reporter: reporter,
                    gasPrice: gasPrice,
                    cwd: cwd,
                    web3: web3,
                    network: network,
                    module: module,
                    apm: apmOptions,
                    silent: silent,
                    debug: debug,
                    prepublish: prepublish,
                    prepublishScript: prepublishScript,
                    build: build,
                    buildScript: buildScript,
                    bump: bump,
                    contract: contract,
                    init: init,
                    reuse: reuse,
                    onlyContent: onlyContent,
                    onlyArtifacts: onlyArtifacts,
                    ipfsCheck: ipfsCheck,
                    http: http,
                  })
                  .run()

              case 9:
                _ref10 = _context16.sent
                initialRepo = _ref10.initialRepo
                initialVersion = _ref10.initialVersion
                version = _ref10.version
                contractAddress = _ref10.contract
                deployArtifacts = _ref10.deployArtifacts
                _context16.next = 17
                return exports
                  .runPrepareForPublishTask({
                    reporter: reporter,
                    cwd: cwd,
                    web3: web3,
                    network: network,
                    module: module,
                    apm: apmOptions,
                    silent: silent,
                    debug: debug,
                    publishDir: publishDir,
                    files: files,
                    ignore: ignore,
                    httpServedFrom: httpServedFrom,
                    provider: provider,
                    onlyArtifacts: onlyArtifacts,
                    onlyContent: onlyContent,
                    http: http,
                    // context
                    initialRepo: initialRepo,
                    initialVersion: initialVersion,
                    version: version,
                    contractAddress: contractAddress,
                    deployArtifacts: deployArtifacts,
                  })
                  .run()

              case 17:
                _ref11 = _context16.sent
                pathToPublish = _ref11.pathToPublish
                intent = _ref11.intent
                // Output publish info
                appName = module.appName
                ;(dao = intent.dao),
                  (proxyAddress = intent.proxyAddress),
                  (methodName = intent.methodName),
                  (params = intent.params)
                contentURI = web3.utils.hexToAscii(params[params.length - 1])
                ;(_contentURI$split = contentURI.split(/:(.+)/)),
                  (_contentURI$split2 = _slicedToArray(_contentURI$split, 2)),
                  (contentProvier = _contentURI$split2[0]),
                  (contentLocation = _contentURI$split2[1])

                if (files.length === 1 && path.normalize(files[0]) === '.') {
                  reporter.warning(
                    'Publishing files from the project\'s root folder is not recommended. Consider using the distribution folder of your project: "--files <folder>".'
                  )
                }

                console.log(
                  '\n',
                  'The following information will be published:',
                  '\n',
                  'Contract address: '.concat(
                    chalk.blue(contractAddress || ZERO_ADDRESS)
                  ),
                  '\n',
                  'Content ('
                    .concat(contentProvier, '): ')
                    .concat(chalk.blue(contentLocation)) // TODO: (Gabi) Add extra relevant info (e.g. size)
                  // `Size: ${chalk.blue()}`,
                  // '\n',
                  // `Number of files: ${chalk.blue()}`,
                  // '\n'
                )

                if (contentProvier === 'ipfs') {
                  console.log(
                    '\n',
                    'Explore the ipfs content locally:',
                    '\n',
                    chalk.bold(
                      'http://localhost:8080/ipfs/QmSDgpiHco5yXdyVTfhKxr3aiJ82ynz8V14QcGKicM3rVh/#/explore/'.concat(
                        contentLocation
                      )
                    ),
                    '\n'
                  )
                }

                if (skipConfirmation) {
                  _context16.next = 34
                  break
                }

                _context16.next = 30
                return inquirer.prompt([
                  {
                    type: 'confirm',
                    name: 'confirmation',
                    message: ''.concat(
                      chalk.green('Publish to '.concat(appName, ' repo'))
                    ),
                  },
                ])

              case 30:
                _ref12 = _context16.sent
                confirmation = _ref12.confirmation
                console.log()
                if (!confirmation) process.exit()

              case 34:
                _context16.next = 36
                return exports
                  .runPublishTask({
                    reporter: reporter,
                    gasPrice: gasPrice,
                    web3: web3,
                    wsProvider: wsProvider,
                    module: module,
                    apm: apmOptions,
                    silent: silent,
                    debug: debug,
                    onlyArtifacts: onlyArtifacts,
                    onlyContent: onlyContent,
                    // context
                    dao: dao,
                    proxyAddress: proxyAddress,
                    methodName: methodName,
                    params: params,
                  })
                  .run()

              case 36:
                _ref13 = _context16.sent
                receipt = _ref13.receipt
                transactionPath = _ref13.transactionPath
                ;(transactionHash = receipt.transactionHash),
                  (status = receipt.status)

                if (!status) {
                  reporter.error('\nPublish transaction reverted:\n')
                } else {
                  // If the version is still the same, the publish intent was forwarded but not immediately executed (p.e. Voting)
                  if (initialVersion === version) {
                    console.log(
                      '\n',
                      'Successfully executed: "'.concat(
                        chalk.green(transactionPath[0].description),
                        '"'
                      ),
                      '\n'
                    )
                  } else {
                    logVersion = 'v' + version
                    console.log(
                      '\n',
                      'Successfully published '
                        .concat(appName, ' ')
                        .concat(chalk.green(logVersion), ' :'),
                      '\n'
                    )
                  }
                }

                console.log(
                  'Transaction hash: '.concat(chalk.blue(transactionHash)),
                  '\n'
                )
                reporter.debug(
                  'Published directory: '.concat(
                    chalk.blue(pathToPublish),
                    '\n'
                  )
                ) // Propagate content

                if (!(!http && propagateContent)) {
                  _context16.next = 62
                  break
                }

                if (skipConfirmation) {
                  _context16.next = 51
                  break
                }

                _context16.next = 47
                return inquirer.prompt([
                  {
                    type: 'confirm',
                    name: 'confirmation',
                    message: chalk.green('Propagate content'),
                  },
                ])

              case 47:
                _ref14 = _context16.sent
                _confirmation = _ref14.confirmation
                console.log()
                if (!_confirmation) process.exit()

              case 51:
                _context16.next = 53
                return propagateIPFS.task({
                  apmOptions: apmOptions,
                  cid: contentLocation,
                  debug: debug,
                  silent: silent,
                })

              case 53:
                propagateTask = _context16.sent
                _context16.next = 56
                return propagateTask.run()

              case 56:
                _ref15 = _context16.sent
                CIDs = _ref15.CIDs
                result = _ref15.result
                console.log(
                  '\n',
                  'Queried '
                    .concat(chalk.blue(CIDs.length), ' CIDs at ')
                    .concat(chalk.blue(result.gateways.length), ' gateways'),
                  '\n',
                  'Requests succeeded: '.concat(chalk.green(result.succeeded)),
                  '\n',
                  'Requests failed: '.concat(chalk.red(result.failed)),
                  '\n'
                )
                reporter.debug('Gateways: '.concat(result.gateways.join(', ')))
                reporter.debug(
                  'Errors: \n'.concat(
                    result.errors.map(JSON.stringify).join('\n')
                  )
                ) // TODO: add your own gateways

              case 62:
                process.exit()

              case 63:
              case 'end':
                return _context16.stop()
            }
          }
        }, _callee16)
      })
    )

    return function(_x23) {
      return _ref9.apply(this, arguments)
    }
  })()
// # sourceMappingURL=publish.js.map
