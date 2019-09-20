"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.split");

require("regenerator-runtime/runtime");

var _lib = require("../lib");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('util'),
    promisify = _require.promisify;

var clone = promisify(require('git-clone'));

var TaskList = require('listr');

var _require2 = require('../util'),
    installDeps = _require2.installDeps,
    isValidAragonId = _require2.isValidAragonId;

var defaultAPMName = require('../helpers/default-apm');

var listrOpts = require('../helpers/listr-options');

var execa = require('execa');

exports.command = '* <name> [template]';
exports.describe = 'Create a new aragon application';

exports.builder = function (yargs) {
  return yargs.positional('name', {
    description: 'The application name (appname.aragonpm.eth)'
  }).option('cwd', {
    description: 'The current working directory',
    "default": process.cwd()
  }).positional('template', {
    description: 'The template to scaffold from',
    "default": 'react',
    coerce: function resolveTemplateName(tmpl) {
      var aliases = {
        bare: 'aragon/aragon-bare-boilerplate',
        react: 'aragon/aragon-react-boilerplate',
        tutorial: 'aragon/your-first-aragon-app'
      };

      if (!tmpl.includes('/')) {
        if (tmpl === 'react-kit') {
          throw new Error("The 'react-kit' boilerplate has been deprecated and merged with 'react' boilerplate.");
        } else if (!aliases[tmpl]) {
          throw new Error("No template named ".concat(tmpl, " exists"));
        }

        tmpl = aliases[tmpl];
      }

      return "https://github.com/".concat(tmpl);
    }
  });
};

exports.handler = function (_ref) {
  var reporter = _ref.reporter,
      name = _ref.name,
      template = _ref.template,
      silent = _ref.silent,
      debug = _ref.debug;
  name = defaultAPMName(name);
  var basename = name.split('.')[0];
  var tasks = new TaskList([{
    title: 'Preparing initialization',
    task: function () {
      var _task2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(ctx, _task) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _task.output = 'Checking if project folder already exists...';

                if (isValidAragonId(basename)) {
                  _context.next = 3;
                  break;
                }

                throw new Error(reporter.error('Invalid project name. Please only use lowercase alphanumeric and hyphen characters.'));

              case 3:
                _context.next = 5;
                return (0, _lib.checkProjectExists)(basename);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function task(_x, _x2) {
        return _task2.apply(this, arguments);
      }

      return task;
    }()
  }, {
    title: 'Cloning app template',
    task: function () {
      var _task4 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(ctx, _task3) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _task3.output = "Cloning ".concat(template, " into ").concat(basename, "...");
                _context2.next = 3;
                return clone(template, basename, {
                  shallow: true
                });

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function task(_x3, _x4) {
        return _task4.apply(this, arguments);
      }

      return task;
    }()
  }, {
    title: 'Preparing template',
    task: function () {
      var _task6 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(ctx, _task5) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _task5.output = 'Initiliazing arapp.json and removing Git repository';
                _context3.next = 3;
                return (0, _lib.prepareTemplate)(basename, name);

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function task(_x5, _x6) {
        return _task6.apply(this, arguments);
      }

      return task;
    }(),
    enabled: function enabled() {
      return !template.includes('your-first-aragon-app');
    }
  }, {
    title: 'Installing package dependencies',
    task: function () {
      var _task8 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(ctx, _task7) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", installDeps(basename, _task7));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function task(_x7, _x8) {
        return _task8.apply(this, arguments);
      }

      return task;
    }()
  }, {
    title: 'Check IPFS',
    task: function () {
      var _task10 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(ctx, _task9) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                ctx.ipfsMissing = false;
                _context5.next = 4;
                return execa('ipfs', ['version']);

              case 4:
                _context5.next = 9;
                break;

              case 6:
                _context5.prev = 6;
                _context5.t0 = _context5["catch"](0);
                ctx.ipfsMissing = true;

              case 9:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 6]]);
      }));

      function task(_x9, _x10) {
        return _task10.apply(this, arguments);
      }

      return task;
    }()
  }, {
    title: 'Installing IPFS',
    enabled: function enabled(ctx) {
      return ctx.ipfsMissing;
    },
    task: function () {
      var _task12 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(ctx, _task11) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return execa('npx', ['aragon', 'ipfs', 'install', '--skip-confirmation']);

              case 2:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function task(_x11, _x12) {
        return _task12.apply(this, arguments);
      }

      return task;
    }()
  }], listrOpts(silent, debug));
  return tasks.run().then(function () {
    reporter.success("Created new application ".concat(name, " in ").concat(basename, "."));
  });
};
//# sourceMappingURL=create-aragon-app.js.map