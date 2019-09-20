"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.object.define-property");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var chalk = require('chalk');

var figures = require('figures');

var ICON_MAP = {
  debug: {
    color: 'magenta',
    symbol: 'pointer'
  },
  info: {
    color: 'blue',
    symbol: 'info'
  },
  warning: {
    color: 'yellow',
    symbol: 'warning'
  },
  error: {
    color: 'red',
    symbol: 'cross'
  },
  success: {
    color: 'green',
    symbol: 'tick'
  }
};

var getIcon = function getIcon(name) {
  var _ICON_MAP$name = ICON_MAP[name],
      color = _ICON_MAP$name.color,
      symbol = _ICON_MAP$name.symbol;
  return chalk[color](figures[symbol]);
};

module.exports =
/*#__PURE__*/
function () {
  function ConsoleReporter() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      silent: false
    };

    _classCallCheck(this, ConsoleReporter);

    this.silent = opts.silent;
  }

  _createClass(ConsoleReporter, [{
    key: "message",
    value: function message() {
      var _console;

      var category = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'info';
      if (this.silent) return;
      var icon = getIcon(category);

      for (var _len = arguments.length, messages = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        messages[_key - 1] = arguments[_key];
      }

      (_console = console).log.apply(_console, [icon].concat(messages));
    }
  }, {
    key: "debug",
    value: function debug() {
      for (var _len2 = arguments.length, messages = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        messages[_key2] = arguments[_key2];
      }

      if (global.DEBUG_MODE) this.message.apply(this, ['debug'].concat(messages));
    }
  }, {
    key: "info",
    value: function info() {
      for (var _len3 = arguments.length, messages = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        messages[_key3] = arguments[_key3];
      }

      this.message.apply(this, ['info'].concat(messages));
    }
  }, {
    key: "warning",
    value: function warning() {
      for (var _len4 = arguments.length, messages = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        messages[_key4] = arguments[_key4];
      }

      this.message.apply(this, ['warning'].concat(messages));
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len5 = arguments.length, messages = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        messages[_key5] = arguments[_key5];
      }

      this.message.apply(this, ['error'].concat(messages));
    }
  }, {
    key: "success",
    value: function success() {
      for (var _len6 = arguments.length, messages = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        messages[_key6] = arguments[_key6];
      }

      this.message.apply(this, ['success'].concat(messages));
    }
  }, {
    key: "newLine",
    value: function newLine() {
      console.log();
    }
  }]);

  return ConsoleReporter;
}();
//# sourceMappingURL=ConsoleReporter.js.map