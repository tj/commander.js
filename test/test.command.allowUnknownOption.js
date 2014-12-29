/**
 * Module dependencies.
 */

var util = require('util');
var program = require('../')
  , should = require('should');

var oldProcessExit = process.exit;
var oldConsoleError = console.error;

program
  .version('0.0.1')
  .option('-p, --pepper', 'add pepper');

var consoleErrors = [];
process.exit = function () {
};
console.error = function () {
  consoleErrors.push(util.format.apply(util, arguments));
};

program.parse('node test -m'.split(' '));
consoleErrors.length.should.equal(3);

// test subcommand
var consoleErrors = [];
program
  .command('sub')
  .action(function () {
  });
program.parse('node test sub -m'.split(' '));
consoleErrors.length.should.equal(3);

consoleErrors = [];
program
  .version('0.0.1')
  .option('-p, --pepper', 'add pepper');

program
  .allowUnknownOption()
  .parse('node test -m'.split(' '));
consoleErrors.length.should.equal(0);

// test subcommand
var consoleErrors = [];
program
  .command('sub')
  .allowUnknownOption()
  .action(function () {
  });
program.parse('node test sub -m'.split(' '));
consoleErrors.length.should.equal(3);

process.exit = oldProcessExit;
console.error = oldConsoleError;

