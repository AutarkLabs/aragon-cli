'use strict'

require('core-js/modules/es.array.find')

require('core-js/modules/es.array.includes')

require('core-js/modules/es.function.name')

require('core-js/modules/es.regexp.constructor')

require('core-js/modules/es.regexp.exec')

require('core-js/modules/es.regexp.to-string')

require('core-js/modules/es.string.includes')

require('core-js/modules/es.string.replace')

module.exports = function(web3, abi, initFunctionName, initArgs) {
  var methodABI = abi.find(function(method) {
    return method.name === initFunctionName
  })

  if (!methodABI) {
    return '0x'
  } else {
    try {
      // parse array parameters from string inputs
      for (var i in methodABI.inputs) {
        if (methodABI.inputs[i].type.includes('[')) {
          initArgs[i] = JSON.parse(
            initArgs[i].replace(new RegExp("'", 'g'), '"')
          )
        }
      }

      return web3.eth.abi.encodeFunctionCall(methodABI, initArgs)
    } catch (e) {
      throw new Error(
        'Invalid initialization params for app. Check the arguments passed with the --app-init-args flag\n' +
          e.message
      )
    }
  }
}
// # sourceMappingURL=encodeInitPayload.js.map
