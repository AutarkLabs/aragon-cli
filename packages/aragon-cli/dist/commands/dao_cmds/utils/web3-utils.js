'use strict'

require('core-js/modules/es.object.define-property')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.addressesEqual = addressesEqual
exports.etherToWei = etherToWei

// Check address equality without checksums
function addressesEqual(first, second) {
  first = first && first.toLowerCase()
  second = second && second.toLowerCase()
  return first === second
}

function etherToWei(ether) {
  return ether * 10e17
}
// # sourceMappingURL=web3-utils.js.map
