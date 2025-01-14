const daoArg = require('../utils/daoArg')
const aclExecHandler = require('./utils/aclExecHandler')

// Note: we usually order these values as entity, proxy, role but this order fits
//       better with other CLI commands
exports.command = 'grant <dao> <app> <role> <entity>'

exports.describe =
  'Grant a permission in a DAO (only permission manager can do it)'

exports.builder = function(yargs) {
  return daoArg(yargs)
}

exports.handler = async function({
  reporter,
  dao,
  app,
  role,
  entity,
  network,
  wsProvider,
  apm,
  gasPrice,
}) {
  const method = 'grantPermission'
  const params = [entity, app, role]
  return aclExecHandler(dao, method, params, {
    reporter,
    gasPrice,
    apm,
    network,
    wsProvider,
    role,
  })
}
