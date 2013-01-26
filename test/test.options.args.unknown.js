/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-f, --foo', 'add some foo')
  .option('-b, --bar', 'add some bar');

// Make sure we still catch errors with required values for options
var exceptionOccurred = false;
var oldProcessExit = process.exit;
var oldConsoleError = console.error;
process.exit = function() { exceptionOccurred = true; throw new Error(); };
console.error = function() {};

try {
  program.parse(['node', 'test', '--foo', '--unknown']);
} catch (ex) {
}
exceptionOccurred.should.be.true;
exceptionOccurred = false;

try {
  program.parse(['node', 'test', '--foo', '-u', 'args1']);
} catch (ex) {
}
exceptionOccurred.should.be.true;
exceptionOccurred = false;

try {
  program.parse(['node', 'test', '--foo', '--unknown', 'args1', 'args2']);
} catch (ex) {
}
exceptionOccurred.should.be.true;
exceptionOccurred = false;

process.exit = oldProcessExit;
console.error = oldConsoleError;
