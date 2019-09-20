#!/usr/bin/env node
"use strict";

require("core-js/modules/es.array.slice");

require("core-js/stable");

require("regenerator-runtime/runtime");

var ConsoleReporter = require('./reporters/ConsoleReporter'); // Set up commands


var cmd = require('yargs').parserConfiguration({
  'parse-numbers': false
}).commandDir('./commands', {
  visit: function visit(cmd) {
    return cmd;
  }
}); // .strict()


cmd.alias('h', 'help');
cmd.alias('v', 'version'); // Configure CLI behaviour

cmd.demandCommand(1, 'You need to specify a command'); // Set global options

cmd.option('silent', {
  description: 'Silence output to terminal',
  "boolean": true,
  "default": false
});
cmd.option('debug', {
  description: 'Show more output to terminal',
  "boolean": true,
  "default": false,
  coerce: function coerce(debug) {
    if (debug || process.env.DEBUG) {
      global.DEBUG_MODE = true;
      return true;
    }
  }
}); // Add epilogue

cmd.epilogue('For more information, check out https://hack.aragon.org'); // Run

var reporter = new ConsoleReporter();
reporter.debug(JSON.stringify(process.argv));
cmd.fail(function (msg, err, yargs) {
  reporter.error(msg || err.message || 'An error occurred');

  if (!err) {
    yargs.showHelp();
  } else if (err.stack) {
    reporter.debug(err.stack);
  }

  process.exit(1);
}).parse(process.argv.slice(2), {
  reporter: reporter
});
//# sourceMappingURL=cli.js.map