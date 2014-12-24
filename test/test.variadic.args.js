/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should')
  , util = require('util')
  , programArgs = ['node', 'test', 'mycommand', 'arg0', 'arg1', 'arg2', 'arg3']
  , requiredArg
  , variadicArg;

program
  .version('0.0.1')
  .command('mycommand <id> [variadicArg...]')
  .action(function (arg0, arg1) {
    requiredArg = arg0;
    variadicArg = arg1;
  });

program.parse(programArgs);

requiredArg.should.eql('arg0');
variadicArg.should.eql(['arg1', 'arg2', 'arg3']);

program.args.should.have.lengthOf(3);
program.args[0].should.eql('arg0');
program.args[1].should.eql(['arg1', 'arg2', 'arg3']);

program
  .version('0.0.1')
  .command('mycommand <variadicArg...> [optionalArg]')
  .action(function (arg0, arg1) {

  });

// Make sure we still catch errors with required values for options
var consoleErrors = [];
var oldProcessExit = process.exit;
var oldConsoleError = console.error;
var errorMessage;

process.exit = function () {
  throw new Error(consoleErrors.join('\n'));
};
console.error = function () {
  consoleErrors.push(util.format.apply(util, arguments));
};

try {
  program.parse(programArgs);

  should.fail(null, null, 'An Error should had been thrown above');
} catch (err) {
  errorMessage = err.message;
}

process.exit = oldProcessExit;
console.error = oldConsoleError;

[
  '',
  '  error: variadic arguments must be last `variadicArg\'',
  ''
].join('\n').should.eql(errorMessage);
