'use strict'

require('core-js/modules/es.object.to-string')

require('core-js/modules/es.promise')

require('regenerator-runtime/runtime')

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

var _require = require('../util')
var getRecommendedGasLimit = _require.getRecommendedGasLimit

module.exports = function(_ref) {
  var web3 = _ref.web3
  var gasPrice = _ref.gasPrice
  var network = _ref.network

  var getACL =
    /* #__PURE__ */
    (function() {
      var _ref2 = _asyncToGenerator(
        /* #__PURE__ */
        regeneratorRuntime.mark(function _callee(repoAddr) {
          var repo, daoAddr, dao, aclAddr
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  repo = new web3.eth.Contract(
                    require('@aragon/os/build/contracts/AragonApp').abi,
                    repoAddr
                  )
                  _context.next = 3
                  return repo.methods.kernel().call()

                case 3:
                  daoAddr = _context.sent
                  dao = new web3.eth.Contract(
                    require('@aragon/os/build/contracts/Kernel').abi,
                    daoAddr
                  )
                  _context.next = 7
                  return dao.methods.acl().call()

                case 7:
                  aclAddr = _context.sent
                  return _context.abrupt(
                    'return',
                    new web3.eth.Contract(
                      require('@aragon/os/build/contracts/ACL').abi,
                      aclAddr
                    )
                  )

                case 9:
                case 'end':
                  return _context.stop()
              }
            }
          }, _callee)
        })
      )

      return function getACL(_x) {
        return _ref2.apply(this, arguments)
      }
    })()

  var getRoleId =
    /* #__PURE__ */
    (function() {
      var _ref3 = _asyncToGenerator(
        /* #__PURE__ */
        regeneratorRuntime.mark(function _callee2(repoAddr) {
          var repo
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch ((_context2.prev = _context2.next)) {
                case 0:
                  repo = new web3.eth.Contract(
                    require('@aragon/os/build/contracts/Repo').abi,
                    repoAddr
                  )
                  return _context2.abrupt(
                    'return',
                    repo.methods.CREATE_VERSION_ROLE().call()
                  )

                case 2:
                case 'end':
                  return _context2.stop()
              }
            }
          }, _callee2)
        })
      )

      return function getRoleId(_x2) {
        return _ref3.apply(this, arguments)
      }
    })()

  return {
    grant: (function() {
      var _grant = _asyncToGenerator(
        /* #__PURE__ */
        regeneratorRuntime.mark(function _callee3(repoAddr, grantee) {
          var acl, roleId, call, estimatedGas
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch ((_context3.prev = _context3.next)) {
                case 0:
                  _context3.next = 2
                  return getACL(repoAddr)

                case 2:
                  acl = _context3.sent
                  _context3.next = 5
                  return getRoleId(repoAddr)

                case 5:
                  roleId = _context3.sent
                  call = acl.methods.grantPermission(grantee, repoAddr, roleId)
                  estimatedGas = call.estimateGas()
                  _context3.t0 = acl.options.address
                  _context3.t1 = call.encodeABI()
                  _context3.next = 12
                  return getRecommendedGasLimit(web3, estimatedGas)

                case 12:
                  _context3.t2 = _context3.sent
                  _context3.t3 = network.gasPrice || gasPrice
                  return _context3.abrupt('return', {
                    to: _context3.t0,
                    data: _context3.t1,
                    gas: _context3.t2,
                    gasPrice: _context3.t3,
                  })

                case 15:
                case 'end':
                  return _context3.stop()
              }
            }
          }, _callee3)
        })
      )

      function grant(_x3, _x4) {
        return _grant.apply(this, arguments)
      }

      return grant
    })(),
  }
}
// # sourceMappingURL=index.js.map
