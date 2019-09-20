'use strict'

require('core-js/modules/es.array.for-each')

require('core-js/modules/es.object.define-property')

require('core-js/modules/es.object.keys')

require('core-js/modules/web.dom-collections.for-each')

Object.defineProperty(exports, '__esModule', {
  value: true,
})

var _downloadClient = require('./download-client')

Object.keys(_downloadClient).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _downloadClient[key]
    },
  })
})

var _startClient = require('./start-client')

Object.keys(_startClient).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _startClient[key]
    },
  })
})

var _fetchClient = require('./fetch-client')

Object.keys(_fetchClient).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _fetchClient[key]
    },
  })
})

var _openClient = require('./open-client')

Object.keys(_openClient).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _openClient[key]
    },
  })
})

var _buildClient = require('./build-client')

Object.keys(_buildClient).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _buildClient[key]
    },
  })
})
// # sourceMappingURL=index.js.map
