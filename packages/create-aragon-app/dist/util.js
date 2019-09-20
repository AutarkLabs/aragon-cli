"use strict";

require("core-js/modules/es.array.concat");

var execa = require('execa');

var PGK_MANAGER_BIN_NPM = 'npm';

var getNodePackageManager = function getNodePackageManager() {
  return PGK_MANAGER_BIN_NPM;
};

var installDeps = function installDeps(cwd, task) {
  var bin = getNodePackageManager();
  var installTask = execa(bin, ['install'], {
    cwd: cwd
  });
  installTask.stdout.on('data', function (log) {
    if (!log) return;
    task.output = log;
  });
  return installTask["catch"](function (err) {
    throw new Error("".concat(err.message, "\n").concat(err.stderr, "\n\nFailed to install dependencies. See above output."));
  });
};
/**
 * Validates an Aragon Id
 * @param {string} aragonId Aragon Id
 * @returns {boolean} `true` if valid
 */


function isValidAragonId(aragonId) {
  return /^[a-z0-9-]+$/.test(aragonId);
}

module.exports = {
  installDeps: installDeps,
  isValidAragonId: isValidAragonId,
  getNodePackageManager: getNodePackageManager
};
//# sourceMappingURL=util.js.map