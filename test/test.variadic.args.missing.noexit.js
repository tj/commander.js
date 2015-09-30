/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should')
  , programArgs = ['node', 'test', 'mycommand', 'arg0', 'arg1', 'arg2', 'arg3'];

var oldProcessExit = process.exit;

// Test for clients that override process.exit
process.exit = function () {
};

program
  .version('0.0.1')
  .command('mycommand <variadicArg...> [optionalArg]')
  .action(function (arg0, arg1) {
    should.fail(null, null, 'The action should not have been executed');
  });

program.parse(programArgs);

process.exit = oldProcessExit;