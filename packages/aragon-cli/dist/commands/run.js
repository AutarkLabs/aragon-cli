'use strict'

require('core-js/modules/es.symbol')

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.filter')

require('core-js/modules/es.array.for-each')

require('core-js/modules/es.array.join')

require('core-js/modules/es.array.map')

require('core-js/modules/es.array.slice')

require('core-js/modules/es.object.define-properties')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.get-own-property-descriptor')

require('core-js/modules/es.object.get-own-property-descriptors')

require('core-js/modules/es.object.keys')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.string.split')

require('core-js/modules/es.string.bold')

require('core-js/modules/web.dom-collections.for-each')

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

var TaskList = require('listr')

var Web3 = require('web3')

var chalk = require('chalk')

var path = require('path')

var devchain = require('./devchain_cmds/start')

var start = require('./start')

var deploy = require('./deploy')

var newDAO = require('./dao_cmds/new')

var startIPFS = require('./ipfs_cmds/start')

var encodeInitPayload = require('./dao_cmds/utils/encodeInitPayload')

var fs = require('fs-extra')

var pkg = require('../../package.json')

var listrOpts = require('@aragon/cli-utils/src/helpers/listr-options')

var APM = require('@aragon/apm')

var getRepoTask = require('./dao_cmds/utils/getRepoTask')

var _require = require('./apm_cmds/publish')
var runSetupTask = _require.runSetupTask
var runPrepareForPublishTask = _require.runPrepareForPublishTask
var runPublishTask = _require.runPublishTask

var _require2 = require('../util')
var findProjectRoot = _require2.findProjectRoot
var isPortTaken = _require2.isPortTaken

var url = require('url')

var DEFAULT_CLIENT_REPO = pkg.aragon.clientRepo
var DEFAULT_CLIENT_VERSION = pkg.aragon.clientVersion
var DEFAULT_CLIENT_PORT = pkg.aragon.clientPort
exports.command = 'run'
exports.describe = 'Run the current app locally'

exports.builder = function(yargs) {
  return yargs
    .option('client', {
      description: 'Just run the smart contracts, without the Aragon client',
      default: true,
      boolean: true,
    })
    .option('files', {
      description:
        'Path(s) to directories containing files to publish. Specify multiple times to include multiple files.',
      default: ['.'],
      array: true,
    })
    .option('port', {
      description: 'Port to start devchain at',
      default: '8545',
    })
    .option('network-id', {
      description: 'Network id to connect with',
    })
    .option('block-time', {
      description: 'Specify blockTime in seconds for automatic mining',
    })
    .option('accounts', {
      default: 2,
      description: 'Number of accounts to print',
    })
    .option('reset', {
      default: false,
      boolean: true,
      description: 'Reset devchain to snapshot',
    })
    .option('kit', {
      description: '(deprecated) Kit contract name',
    })
    .option('kit-init', {
      description: '(deprecated) Arguments to be passed to the kit constructor',
      array: true,
    })
    .option('kit-deploy-event', {
      description:
        '(deprecated) Event name that the template will fire on success',
    })
    .option('template', {
      default: newDAO.BARE_TEMPLATE,
      description: 'Template contract name',
    })
    .option('template-init', {
      description: 'Arguments to be passed to the template constructor',
      array: true,
      default: [],
    })
    .option('template-deploy-event', {
      description: 'Event name that the template will fire on success',
      default: newDAO.BARE_TEMPLATE_DEPLOY_EVENT,
    })
    .option('template-new-instance', {
      description: 'Function to be called to create template instance',
      default: newDAO.BARE_INSTANCE_FUNCTION,
    })
    .option('template-args', {
      description:
        'Arguments to be passed to the function specified in --template-new-instance',
      array: true,
      default: [],
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
    .option('publish-dir', {
      description:
        'Temporary directory where files will be copied before publishing. Defaults to temp dir.',
      default: null,
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
    .option('bump', {
      description:
        'Type of bump (major, minor or patch) or version number to publish the app',
      type: 'string',
      default: 'major',
    })
    .option('http', {
      description: 'URL for where your app is served from e.g. localhost:1234',
      default: null,
    })
    .option('http-served-from', {
      description:
        'Directory where your files is being served from e.g. ./dist',
      default: null,
    })
    .option('app-init', {
      description:
        'Name of the function that will be called to initialize an app',
      default: 'initialize',
    })
    .option('app-init-args', {
      description: 'Arguments for calling the app init function',
      array: true,
      default: [],
    })
    .option('client-repo', {
      description: 'Repo of Aragon client used to run your sandboxed app',
      default: DEFAULT_CLIENT_REPO,
    })
    .option('client-version', {
      description: 'Version of Aragon client used to run your sandboxed app',
      default: DEFAULT_CLIENT_VERSION,
    })
    .option('client-port', {
      description: 'Port being used by Aragon client',
      default: DEFAULT_CLIENT_PORT,
    })
    .option('client-path', {
      description: 'A path pointing to an existing Aragon client installation',
      default: null,
    })
}

exports.handler = function(_ref) {
  var reporter = _ref.reporter
  var gasPrice = _ref.gasPrice
  var cwd = _ref.cwd
  var apmOptions = _ref.apm
  var silent = _ref.silent
  var debug = _ref.debug
  var network = _ref.network
  var module = _ref.module
  var client = _ref.client
  var files = _ref.files
  var port = _ref.port
  var networkId = _ref.networkId
  var blockTime = _ref.blockTime
  var accounts = _ref.accounts
  var reset = _ref.reset
  var kit = _ref.kit
  var kitInit = _ref.kitInit
  var kitDeployEvent = _ref.kitDeployEvent
  var template = _ref.template
  var templateInit = _ref.templateInit
  var templateDeployEvent = _ref.templateDeployEvent
  var templateNewInstance = _ref.templateNewInstance
  var templateArgs = _ref.templateArgs
  var build = _ref.build
  var buildScript = _ref.buildScript
  var publishDir = _ref.publishDir
  var prepublish = _ref.prepublish
  var prepublishScript = _ref.prepublishScript
  var bump = _ref.bump
  var http = _ref.http
  var httpServedFrom = _ref.httpServedFrom
  var appInit = _ref.appInit
  var appInitArgs = _ref.appInitArgs
  var clientRepo = _ref.clientRepo
  var clientVersion = _ref.clientVersion
  var clientPort = _ref.clientPort
  var clientPath = _ref.clientPath
  apmOptions.ensRegistryAddress = apmOptions['ens-registry'] // TODO: this can be cleaned up once kits is no longer supported

  template = kit || template
  templateInit = kitInit || templateInit
  templateDeployEvent = kitDeployEvent || templateDeployEvent
  var showAccounts = accounts
  var tasks = new TaskList(
    [
      {
        title: 'Start a local Ethereum network',
        skip: (function() {
          var _skip = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee(ctx) {
              var hostURL
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      hostURL = new url.URL(network.provider.connection._url)
                      _context.next = 3
                      return isPortTaken(hostURL.port)

                    case 3:
                      if (_context.sent) {
                        _context.next = 7
                        break
                      }

                      return _context.abrupt('return', false)

                    case 7:
                      ctx.web3 = new Web3(network.provider)
                      _context.next = 10
                      return ctx.web3.eth.getAccounts()

                    case 10:
                      ctx.accounts = _context.sent
                      return _context.abrupt(
                        'return',
                        'Connected to the provided Ethereum network'
                      )

                    case 12:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee)
            })
          )

          function skip(_x) {
            return _skip.apply(this, arguments)
          }

          return skip
        })(),
        task: (function() {
          var _task2 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee2(ctx, _task) {
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      return _context2.abrupt(
                        'return',
                        devchain.task({
                          port: port,
                          networkId: networkId,
                          blockTime: blockTime,
                          reset: reset,
                          showAccounts: showAccounts,
                        })
                      )

                    case 1:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2)
            })
          )

          function task(_x2, _x3) {
            return _task2.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Check IPFS',
        task: function task() {
          return startIPFS.task({
            apmOptions: apmOptions,
          })
        },
        enabled: function enabled() {
          return !http || template
        },
      },
      {
        title: 'Setup before publish',
        task: (function() {
          var _task3 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee3(ctx) {
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch ((_context3.prev = _context3.next)) {
                    case 0:
                      ctx.publishParams = {
                        provider: 'ipfs',
                        files: files,
                        ignore: ['node_modules'],
                        reporter: reporter,
                        gasPrice: gasPrice,
                        cwd: cwd,
                        network: network,
                        module: module,
                        buildScript: buildScript,
                        build: build,
                        publishDir: publishDir,
                        prepublishScript: prepublishScript,
                        prepublish: prepublish,
                        contract: deploy.arappContract(),
                        web3: ctx.web3,
                        apm: apmOptions,
                        bump: bump,
                        http: http,
                        httpServedFrom: httpServedFrom,
                      }
                      return _context3.abrupt(
                        'return',
                        runSetupTask(ctx.publishParams)
                      )

                    case 2:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3)
            })
          )

          function task(_x4) {
            return _task3.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Prepare for publish',
        task: (function() {
          var _task4 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee4(ctx) {
              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch ((_context4.prev = _context4.next)) {
                    case 0:
                      return _context4.abrupt(
                        'return',
                        runPrepareForPublishTask(
                          _objectSpread({}, ctx.publishParams, {
                            // context
                            initialRepo: ctx.initialRepo,
                            initialVersion: ctx.initialVersion,
                            version: ctx.version,
                            contractAddress: ctx.contract,
                            deployArtifacts: ctx.deployArtifacts,
                          })
                        )
                      )

                    case 1:
                    case 'end':
                      return _context4.stop()
                  }
                }
              }, _callee4)
            })
          )

          function task(_x5) {
            return _task4.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Publish app to aragonPM',
        task: (function() {
          var _task5 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee5(ctx) {
              var _ctx$intent, dao, proxyAddress, methodName, params

              return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                  switch ((_context5.prev = _context5.next)) {
                    case 0:
                      ;(_ctx$intent = ctx.intent),
                        (dao = _ctx$intent.dao),
                        (proxyAddress = _ctx$intent.proxyAddress),
                        (methodName = _ctx$intent.methodName),
                        (params = _ctx$intent.params)
                      return _context5.abrupt(
                        'return',
                        runPublishTask(
                          _objectSpread({}, ctx.publishParams, {
                            // context
                            dao: dao,
                            proxyAddress: proxyAddress,
                            methodName: methodName,
                            params: params,
                          })
                        )
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
            return _task5.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Fetch published repo',
        task: (function() {
          var _task6 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee6(ctx) {
              return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                  switch ((_context6.prev = _context6.next)) {
                    case 0:
                      _context6.next = 2
                      return getRepoTask.task({
                        apmRepo: module.appName,
                        apm: APM(ctx.web3, apmOptions),
                        artifactRequired: false,
                      })(ctx)

                    case 2:
                    case 'end':
                      return _context6.stop()
                  }
                }
              }, _callee6)
            })
          )

          function task(_x7) {
            return _task6.apply(this, arguments)
          }

          return task
        })(),
      },
      {
        title: 'Deploy Template',
        enabled: function enabled() {
          return template !== newDAO.BARE_TEMPLATE
        },
        task: function task(ctx) {
          var deployParams = {
            contract: template,
            init: templateInit,
            reporter: reporter,
            gasPrice: gasPrice,
            network: network,
            cwd: cwd,
            web3: ctx.web3,
            apmOptions: apmOptions,
          }
          return deploy.task(deployParams)
        },
      },
      {
        title: 'Create DAO',
        task: function task(ctx) {
          var roles = ctx.repo.roles || []
          var rolesBytes = roles.map(function(role) {
            return role.bytes
          })
          var fnArgs

          if (ctx.contractInstance) {
            // If template was deployed, use template args
            fnArgs = templateArgs
          } else {
            // TODO: Report warning when app wasn't initialized
            var initPayload = encodeInitPayload(
              ctx.web3,
              ctx.repo.abi,
              appInit,
              appInitArgs
            )

            if (initPayload === '0x') {
              ctx.notInitialized = true
            }

            fnArgs = [ctx.repo.appId, rolesBytes, ctx.accounts[0], initPayload]
          }

          var newDAOParams = {
            template: template,
            templateVersion: 'latest',
            templateInstance: ctx.contractInstance,
            fn: templateNewInstance,
            fnArgs: fnArgs,
            deployEvent: templateDeployEvent,
            gasPrice: gasPrice,
            web3: ctx.web3,
            reporter: reporter,
            apmOptions: apmOptions,
          }
          return newDAO.task(newDAOParams)
        },
      },
      {
        title: 'Open DAO',
        enabled: function enabled() {
          return client === true
        },
        task: (function() {
          var _task8 = _asyncToGenerator(
            /* #__PURE__ */
            regeneratorRuntime.mark(function _callee7(ctx, _task7) {
              return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                  switch ((_context7.prev = _context7.next)) {
                    case 0:
                      return _context7.abrupt(
                        'return',
                        start.task({
                          clientRepo: clientRepo,
                          clientVersion: clientVersion,
                          clientPort: clientPort,
                          clientPath: clientPath,
                        })
                      )

                    case 1:
                    case 'end':
                      return _context7.stop()
                  }
                }
              }, _callee7)
            })
          )

          function task(_x8, _x9) {
            return _task8.apply(this, arguments)
          }

          return task
        })(),
      },
    ],
    listrOpts(silent, debug)
  )
  var manifestPath = path.resolve(findProjectRoot(), 'manifest.json')
  var manifest

  if (fs.existsSync(manifestPath)) {
    manifest = fs.readJsonSync(manifestPath)
  }

  return tasks
    .run({
      ens: apmOptions['ens-registry'],
    })
    .then(
      /* #__PURE__ */
      (function() {
        var _ref2 = _asyncToGenerator(
          /* #__PURE__ */
          regeneratorRuntime.mark(function _callee8(ctx) {
            var registry
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch ((_context8.prev = _context8.next)) {
                  case 0:
                    if (ctx.portOpen) {
                      reporter.warning(
                        'Server already listening at port '.concat(
                          chalk.blue(clientPort),
                          ', skipped starting Aragon'
                        )
                      )
                    }

                    if (ctx.notInitialized) {
                      reporter.warning(
                        'App could not be initialized, check the --app-init flag. Functions protected behind the ACL will not work until the app is initialized'
                      )
                    }

                    if (
                      files.length === 1 &&
                      path.normalize(files[0]) === '.'
                    ) {
                      reporter.warning(
                        'Publishing files from the project\'s root folder is not recommended. Consider using the distribution folder of your project: "--files <folder>".'
                      )
                    }

                    reporter.newLine()
                    reporter.info(
                      'You are now ready to open your app in Aragon.'
                    )
                    reporter.newLine()

                    if (ctx.privateKeys) {
                      devchain.printAccounts(reporter, ctx.privateKeys)
                    }

                    if (ctx.mnemonic) {
                      devchain.printMnemonic(reporter, ctx.mnemonic)
                    }

                    devchain.printResetNotice(reporter, reset)
                    registry = module.appName
                      .split('.')
                      .slice(1)
                      .join('.')
                    reporter.info(
                      'This is the configuration for your development deployment:\n    '
                        .concat(
                          'Ethereum Node',
                          ': ',
                          chalk.blue(network.provider.connection._url),
                          '\n    ',
                          'ENS registry',
                          ': '
                        )
                        .concat(
                          chalk.blue(ctx.ens),
                          '\n    ',
                          'aragonPM registry',
                          ': '
                        )
                        .concat(
                          chalk.blue(registry),
                          '\n    ',
                          'DAO address',
                          ': '
                        )
                        .concat(chalk.green(ctx.daoAddress))
                    )
                    reporter.newLine()
                    reporter.info(
                      ''.concat(
                        client !== false
                          ? 'Opening '.concat(
                              chalk.bold(
                                'http://localhost:'
                                  .concat(clientPort, '/#/')
                                  .concat(ctx.daoAddress)
                              ),
                              ' to view your DAO'
                            )
                          : 'Use '.concat(
                              chalk.bold(
                                '"aragon dao <command> '.concat(
                                  ctx.daoAddress,
                                  '"'
                                )
                              ),
                              ' to interact with your DAO'
                            )
                      )
                    )

                    if (!manifest) {
                      reporter.warning(
                        'No front-end detected (no manifest.json)'
                      )
                    } else if (!manifest.start_url) {
                      reporter.warning(
                        'No front-end detected (no start_url defined)'
                      )
                    }

                    if (kit || kitInit || kitDeployEvent) {
                      reporter.warning(
                        "The use of kits is deprecated and templates should be used instead. The new options for 'aragon run' are '--template', '--template-init' and 'template-deploy-event'"
                      )
                    }

                  case 15:
                  case 'end':
                    return _context8.stop()
                }
              }
            }, _callee8)
          })
        )

        return function(_x10) {
          return _ref2.apply(this, arguments)
        }
      })()
    )
}
// # sourceMappingURL=run.js.map
