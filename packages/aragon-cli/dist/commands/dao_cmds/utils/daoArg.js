'use strict'

var isAddress = function isAddress(addr) {
  return /0x[a-fA-F0-9]{40}/.test(addr)
}

var isValidAragonID = function isValidAragonID(dao) {
  return /[a-z0-9]+\.eth/.test(dao)
}

module.exports = function(yargs) {
  return yargs.positional('dao', {
    description: 'Address of the Kernel or AragonID',
    type: 'string',
    coerce: function coerce(dao) {
      return !isAddress(dao) && !isValidAragonID(dao)
        ? ''.concat(dao, '.aragonid.eth') // append aragonid.eth if needed
        : dao
    },
  })
}
// # sourceMappingURL=daoArg.js.map
