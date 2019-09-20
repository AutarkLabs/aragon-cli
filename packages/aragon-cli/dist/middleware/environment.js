'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.iterator')

require('core-js/modules/es.function.name')

require('core-js/modules/es.object.assign')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.set')

require('core-js/modules/es.string.iterator')

require('core-js/modules/web.dom-collections.iterator')

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

var Web3 = require('web3')

var merge = require('lodash.merge')

var _require = require('../helpers/truffle-config')
var getTruffleConfig = _require.getTruffleConfig

var FRAME_ENDPOINT = 'ws://localhost:1248'
var FRAME_ORIGIN = 'aragonCLI'
var ARAGON_RINKEBY_ENDPOINT = 'wss://rinkeby.eth.aragon.network/ws'
var ARAGON_MAINNET_ENDPOINT = 'wss://mainnet.eth.aragon.network/ws'

var configureNetwork = function configureNetwork(argv, network) {
  var truffleConfig =
    arguments.length > 2 && arguments[2] !== undefined
      ? arguments[2]
      : getTruffleConfig()
  // Catch commands that dont require network and return
  var skipNetworkSubcommands = new Set(['version']) // 'aragon apm version'

  if (argv._.length >= 2) {
    if (skipNetworkSubcommands.has(argv._[1])) {
      return {}
    }
  } // TODO remove init when commmand not longer supported

  var skipNetworkCommands = new Set(['init', 'devchain', 'ipfs', 'contracts'])

  if (argv._.length >= 1) {
    if (skipNetworkCommands.has(argv._[0])) {
      return {}
    }
  }

  if (argv.useFrame) {
    var providerOptions = {
      headers: {
        origin: FRAME_ORIGIN,
      },
    }
    return {
      name: 'frame-'.concat(network),
      provider: new Web3.providers.WebsocketProvider(
        FRAME_ENDPOINT,
        providerOptions
      ),
    }
  }

  var truffleNetwork = truffleConfig.networks[network]

  if (!truffleNetwork) {
    throw new Error(
      "aragon <command> requires a network '".concat(
        network,
        "' in your truffle.js. For an example, see http://truffleframework.com/docs/advanced/configuration"
      )
    )
  }

  var provider

  if (truffleNetwork.provider) {
    if (typeof truffleNetwork.provider === 'function') {
      provider = truffleNetwork.provider()
    } else {
      provider = truffleNetwork.provider
    }
  } else if (truffleNetwork.host && truffleNetwork.port) {
    provider = new Web3.providers.WebsocketProvider(
      'ws://'.concat(truffleNetwork.host, ':').concat(truffleNetwork.port)
    )
  } else {
    provider = new Web3.providers.HttpProvider('http://localhost:8545')
  }

  truffleNetwork.provider = provider
  truffleNetwork.name = network
  return truffleNetwork
} // TODO this can be cleaned up once --network is no longer supported

module.exports = function environmentMiddleware(argv) {
  var runsInCwd = argv._[0] === 'init'
  var reporter = argv.reporter
  var module = argv.module
  var environment = argv.environment
  var network = argv.network
  var apm = argv.apm
  var isTruffleFwd = argv._[0] === 'contracts'

  if (environment && network && !isTruffleFwd) {
    reporter.error(
      "Arguments '--network' and '--environment' are mutually exclusive. Using '--network'  has been deprecated and  '--environment' should be used instead."
    )
    process.exit(1)
  }

  if (!runsInCwd && module) {
    if (network && module.environments && !isTruffleFwd) {
      reporter.error(
        "Your arapp.json contains an `environments` property. The use of '--network' is deprecated and '--environment' should be used instead."
      )
      process.exit(1)
    }

    if (!module.environments) {
      if (environment) {
        reporter.error(
          "Your arapp.json does not contain an `environments` property. The use of '--environment'  is not supported."
        )
        process.exit(1)
      }

      if (!network) network = 'development'
      return {
        network: configureNetwork(argv, network),
      }
    }

    if (!environment) environment = 'default'
    var env = module.environments[environment]

    if (!env) {
      reporter.error(
        ''.concat(
          environment,
          ' environment was not defined in your arapp.json.'
        )
      )
      process.exit(1)
    } // only include the selected environment in the module

    module.environments = _defineProperty({}, environment, env)
    var response = {
      module: Object.assign({}, module, {
        appName: env.appName,
      }),
      network: configureNetwork(argv, env.network),
    } // Override apm options that we find in the environment
    // TODO (daniel) : it should be the other way around though (cli params to override env)

    if (apm) {
      if (env.registry) {
        apm['ens-registry'] = env.registry
      }

      if (env.apm) {
        apm = merge(apm, env.apm)
      }
    }

    if (env.registry) {
      // TODO (daniel) : remove this as it does not seem to be used
      response.apmEnsRegistry = env.registry
    }

    if (env.wsRPC) {
      response.wsProvider = new Web3.providers.WebsocketProvider(env.wsRPC)
    } else {
      if (env.network === 'rinkeby')
        response.wsProvider = new Web3.providers.WebsocketProvider(
          ARAGON_RINKEBY_ENDPOINT
        )
      if (env.network === 'mainnet')
        response.wsProvider = new Web3.providers.WebsocketProvider(
          ARAGON_MAINNET_ENDPOINT
        )
    }

    return response
  } // if there is no arapp.json and the command is not init default to the "global" config
  // designed for the dao commands including dao acl

  if (!module && !runsInCwd) {
    var defaultEnvironments = require('../../config/environments.default')

    var defaultNetworks = require('../../config/truffle.default')

    var _environment = argv.environment
    var _apm = argv.apm
    var _env = defaultEnvironments[_environment || 'aragon:local']

    if (_environment && !_env) {
      reporter.error(
        'Could not find the '.concat(
          _environment,
          ' environment. Try using aragon:local, aragon:rinkeby or aragon:mainnet.'
        )
      )
      process.exit(1)
    }

    reporter.debug(
      "Could not find 'arapp.json'. Using the default configuration to connect to ".concat(
        _env.network,
        '.'
      )
    ) // Override apm options that we find in the environment
    // TODO (daniel) : it should be the other way around though (cli params to override env)

    if (_apm) {
      if (_env.registry) {
        _apm['ens-registry'] = _env.registry
      }

      if (_env.apm) {
        _apm = merge(_apm, _env.apm)
      }
    }

    return {
      // TODO (daniel) : remove this as it does not seem to be used
      apmEnsRegistry: _env.registry,
      network: configureNetwork(argv, _env.network, defaultNetworks),
      wsProvider:
        _env.wsRPC && new Web3.providers.WebsocketProvider(_env.wsRPC),
    }
  }

  return {}
}
// # sourceMappingURL=environment.js.map
