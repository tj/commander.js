/**
 * Module dependencies.
 */

var util = require('util')
  , program = require('../')
  , should = require('should');

var oldProcessExit = process.exit;

// Test for clients that override process.exit
process.exit = function () {
};

program
  .version('0.0.1')
  .option('-c, --cheese <type>', 'specify the type of cheese')
  .action(function() {
    should.fail(null, null, 'The action should not have been executed');
  });

program.parse(['node', 'test', '--cheese']);

process.exit = oldProcessExit;
