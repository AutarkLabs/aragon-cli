#!/usr/bin/env node
'use strict'

require('core-js/modules/es.array.slice')

require('core-js/modules/es.parse-int')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.string.replace')

require('core-js/stable')

require('regenerator-runtime/runtime')

require('source-map-support/register')

var Web3 = require('web3')

var DEFAULT_GAS_PRICE = require('../package.json').aragon.defaultGasPrice

var _require = require('./middleware')
var environmentMiddleware = _require.environmentMiddleware
var manifestMiddleware = _require.manifestMiddleware
var moduleMiddleware = _require.moduleMiddleware

var _require2 = require('./util')
var findProjectRoot = _require2.findProjectRoot

var _require3 = require('@aragon/aragen')
var ens = _require3.ens

var ConsoleReporter = require('@aragon/cli-utils/src/reporters/ConsoleReporter')

var url = require('url')

var MIDDLEWARES = [manifestMiddleware, moduleMiddleware, environmentMiddleware] // Set up commands

var cmd = require('yargs')
  .strict()
  .parserConfiguration({
    'parse-numbers': false,
  })
  .usage('Usage: aragon <command> [options]')
  .commandDir('./commands')

cmd.middleware(MIDDLEWARES)
cmd.alias('env', 'environment')
cmd.alias('h', 'help')
cmd.alias('v', 'version') // blank scriptName so that help text doesn't display "aragon" before each command

cmd.scriptName('') // Configure CLI behaviour

cmd.demandCommand(1, 'You need to specify a command') // Set global options

cmd.option('silent', {
  description: 'Silence output to terminal',
  boolean: true,
  default: false,
})
cmd.option('debug', {
  description: 'Show more output to terminal',
  boolean: true,
  default: false,
  coerce: function coerce(debug) {
    if (debug || process.env.DEBUG) {
      global.DEBUG_MODE = true
      return true
    }
  },
})
cmd.option('gas-price', {
  description: 'Gas price in Gwei',
  default: DEFAULT_GAS_PRICE,
  coerce: function coerce(gasPrice) {
    return Web3.utils.toWei(gasPrice, 'gwei')
  },
})
cmd.option('cwd', {
  description: 'The project working directory',
  default: function _default() {
    try {
      return findProjectRoot()
    } catch (_) {
      return process.cwd()
    }
  },
})
cmd.option('use-frame', {
  description: 'Use frame as a signing provider and web3 provider',
  boolean: true,
  default: false,
}) // network coerce is called multiple times, only warn once

var warnedDeprecatedNetwork = false // Ethereum

cmd.option('network', {
  description:
    '(deprecated) The network in your truffle.js that you want to use. Deprecated in favor of `--environment`',
  coerce: function coerce(network) {
    if (warnedDeprecatedNetwork) {
      return network
    }

    warnedDeprecatedNetwork = true
    reporter.info(
      'Use of `--network` is deprecated and has been replaced with `--environment`. You may need to update your arapp.json'
    )
  },
})
cmd.option('environment', {
  description: 'The environment in your arapp.json that you want to use', // default: 'default'
}) // APM

cmd.option('apm.ens-registry', {
  description:
    "Address of the ENS registry. This will be overwritten if the selected '--environment' from your arapp.json includes a `registry` property",
  default: ens,
})
cmd.group(['apm.ens-registry'], 'APM:')
cmd.option('apm.ipfs.rpc', {
  description: 'An URI to the IPFS node used to publish files',
  default: 'http://localhost:5001#default',
})
cmd.option('apm.ipfs.gateway', {
  description: 'An URI to the IPFS Gateway to read files from',
  default: 'http://localhost:8080/ipfs',
})
cmd.group(['apm.ipfs.rpc', 'apm.ipfs.gateway'], 'APM providers:')
cmd.option('apm', {
  coerce: function coerce(apm) {
    if (apm.ipfs && apm.ipfs.rpc) {
      var uri = new url.URL(apm.ipfs.rpc)
      apm.ipfs.rpc = {
        protocol: uri.protocol.replace(':', ''),
        host: uri.hostname,
        port: parseInt(uri.port),
      }

      if (uri.hash === '#default') {
        apm.ipfs.rpc['default'] = true
      }
    }

    return apm
  },
}) // Add epilogue

cmd.epilogue('For more information, check out https://hack.aragon.org') // Run

var reporter = new ConsoleReporter()
reporter.debug(JSON.stringify(process.argv)) // TODO: this ain't working (DEBUG_MODE not set yet?)

cmd
  .fail(function(msg, err, yargs) {
    reporter.error(msg || err.message || 'An error occurred')

    if (!err) {
      yargs.showHelp()
    } else if (err.stack) {
      reporter.debug(err.stack)
    }

    process.exit(1)
  })
  .parse(process.argv.slice(2), {
    reporter: reporter,
  })
// # sourceMappingURL=cli.js.map
