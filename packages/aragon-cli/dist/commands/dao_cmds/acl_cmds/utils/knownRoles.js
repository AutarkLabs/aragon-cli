'use strict'

require('core-js/modules/es.array.concat')

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

var sha3 = require('js-sha3')

var keccak256 = function keccak256(x) {
  return '0x' + sha3.keccak_256(x)
}

var path = require('path')

var _require = require('../../../../util')
var findProjectRoot = _require.findProjectRoot

var defaultAppsRoles = require('../../../../knownRoles.json')

var currentAppRoles = function currentAppRoles() {
  try {
    var arappPath = path.resolve(findProjectRoot(), 'arapp.json')
    return require(arappPath).roles || []
  } catch (_) {
    return []
  }
} // TODO: add support for user apps

var rolesForApps = function rolesForApps() {
  var allRoles = defaultAppsRoles.concat(currentAppRoles())
  var knownRoles = allRoles.reduce(function(acc, role) {
    return Object.assign(acc, _defineProperty({}, keccak256(role.id), role))
  }, {})
  return knownRoles
}

module.exports = {
  rolesForApps: rolesForApps,
}
// # sourceMappingURL=knownRoles.js.map
