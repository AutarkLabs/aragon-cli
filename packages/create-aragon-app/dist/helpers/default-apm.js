"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.split");

var DEFAULT_APM_REGISTRY = 'aragonpm.eth'; // insert default apm if the provided name doesnt have the suffix

module.exports = function (name) {
  return name.split('.').length > 1 ? name : "".concat(name, ".").concat(DEFAULT_APM_REGISTRY);
};
//# sourceMappingURL=default-apm.js.map