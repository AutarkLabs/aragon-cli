'use strict'

require('core-js/modules/es.array.concat')

require('core-js/modules/es.array.map')

require('core-js/modules/es.array.reduce')

require('core-js/modules/es.object.assign')

require('core-js/modules/es.object.define-property')

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

var namehash = require('eth-ens-namehash').hash

var sha3 = require('js-sha3')

var keccak256 = function keccak256(x) {
  return '0x' + sha3.keccak_256(x)
}

var knownAppNames = [
  'voting',
  'token-manager',
  'finance',
  'vault',
  'agent',
  'survey',
  'payroll',
  'kernel',
  'acl',
  'evmreg',
  'apm-registry',
  'apm-repo',
  'apm-enssub',
]
var knownAPMRegistries = ['aragonpm.eth', 'open.aragonpm.eth']

var listApps = function listApps() {
  var userApps =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
  var appNames = knownAppNames
    .reduce(function(acc, appName) {
      return acc.concat(
        knownAPMRegistries.map(function(apm) {
          return appName + '.' + apm
        })
      )
    }, [])
    .concat(userApps)
  var appIds = appNames.reduce(function(acc, app) {
    return Object.assign(acc, _defineProperty({}, namehash(app), app))
  }, {}) // because of a current issue in the deployed apps, we need to calculate with just the keccak too (otherwise acl and evmreg dont show up)
  // TODO: Fix kernel not showing up

  return appNames.reduce(function(acc, app) {
    return Object.assign(acc, _defineProperty({}, keccak256(app), app))
  }, appIds)
}

module.exports = {
  listApps: listApps,
}
// # sourceMappingURL=knownApps.js.map
