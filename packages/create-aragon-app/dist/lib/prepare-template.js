"use strict";

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareTemplate = prepareTemplate;

require("regenerator-runtime/runtime");

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _replace = _interopRequireDefault(require("replace"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Remove the `.git` dir, licenses and rename the app name and registry.
 * (It will search and replace anything that matches `placeholder-app-name`)
 *
 * @param {string} dir - for example `foo`
 * @param {string} appName - for example `foo.myApmRegistry.eth`
 * @returns {void}
 */
function prepareTemplate(_x, _x2) {
  return _prepareTemplate.apply(this, arguments);
}

function _prepareTemplate() {
  _prepareTemplate = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(dir, appName) {
    var gitFolderPath, licensePath, packageJsonPath, packageJson, defaultRegistries;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            /**
             * Delete .git
             */
            gitFolderPath = _path["default"].resolve(dir, '.git');
            /**
             * Delete licenses
             */

            licensePath = _path["default"].resolve(dir, 'LICENSE');
            packageJsonPath = _path["default"].resolve(dir, 'package.json');
            _context.next = 5;
            return _fsExtra["default"].readJson(packageJsonPath);

          case 5:
            packageJson = _context.sent;
            delete packageJson.license;
            _context.next = 9;
            return _fsExtra["default"].writeJson(packageJsonPath, packageJson, {
              spaces: 2
            });

          case 9:
            defaultRegistries = [// To keep backwards compability, only change `aragonpm.eth`, leave `open.aragonpm.eth`
            'placeholder-app-name.aragonpm.eth' // 'placeholder-app-name.open.aragonpm.eth',
            ];
            defaultRegistries.forEach(function (registry) {
              (0, _replace["default"])({
                regex: registry,
                replacement: appName,
                paths: [dir],
                recursive: true,
                silent: true
              });
            });
            /**
             * Replace the placeholder name with the actual name
             */

            (0, _replace["default"])({
              regex: 'placeholder-app-name',
              replacement: dir,
              paths: [dir],
              recursive: true,
              silent: true
            });
            return _context.abrupt("return", Promise.all([_fsExtra["default"].remove(gitFolderPath), _fsExtra["default"].remove(licensePath)]));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _prepareTemplate.apply(this, arguments);
}
//# sourceMappingURL=prepare-template.js.map