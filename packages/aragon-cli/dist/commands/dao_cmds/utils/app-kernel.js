'use strict'

var _require = require('@aragon/os/build/contracts/AragonApp')
var abi = _require.abi

module.exports = function(web3, appAddress) {
  var app = new web3.eth.Contract(abi, appAddress)
  return app.methods.kernel().call()
}
// # sourceMappingURL=app-kernel.js.map
