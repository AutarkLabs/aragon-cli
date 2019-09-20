'use strict'

require('core-js/modules/es.array.for-each')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.keys')

require('core-js/modules/web.dom-collections.for-each')

Object.defineProperty(exports, '__esModule', {
  value: true,
})

var _checkProjectExists = require('./check-project-exists')

Object.keys(_checkProjectExists).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _checkProjectExists[key]
    },
  })
})

var _prepareTemplate = require('./prepare-template')

Object.keys(_prepareTemplate).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _prepareTemplate[key]
    },
  })
})
// # sourceMappingURL=index.js.map
