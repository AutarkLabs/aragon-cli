"use strict";

var VerboseRenderer = require('listr-verbose-renderer');

var SilentRenderer = require('listr-silent-renderer');

var UpdateRenderer = require('listr-update-renderer');

module.exports = function (silent, debug) {
  if (debug) return VerboseRenderer;
  if (silent) return SilentRenderer;
  return UpdateRenderer;
};
//# sourceMappingURL=ListrRenderer.js.map