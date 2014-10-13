/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

var commandContext;

program
  .version('0.0.1')
  .on('--help', function() {
    helpCommand = this._name;
  });

var setupCommand = program
  .command('setup')
  .action(function(env, options){
    commandContext = this;
  })
  .on('--help', function() {
    helpCommand = this._name;
  });

var addCommand = setupCommand
  .command('add')
  .option('--value [value]')
  .action(function() {
    commandContext = this;
  })
  .on('--help', function() {
    helpCommand = this._name;
  });

var remoteCommand = addCommand
  .command('remote')
  .action(function() {
    commandContext = this;
  })
  .on('--help', function() {
    helpCommand = this._name;
  });

program.parse(['node', 'test', 'setup']);
commandContext._name.should.equal('setup');

program.parse(['node', 'test', 'setup', 'add']);
commandContext._name.should.equal('add');

program.parse(['node', 'test', 'setup', 'add', '--value', 'true']);
commandContext._name.should.equal('add');

program.parse(['node', 'test', 'setup', 'add', 'remote']);
commandContext._name.should.equal('remote');

// Make sure we still catch errors with required values for options
var exceptionOccurred = false;
var oldProcessExit = process.exit;
var oldConsoleError = console.error;
process.exit = function() { exceptionOccurred = true; throw new Error(); };
console.error = function() {};

try {
  program.parse(['node', 'test', '--help']);
} catch(ex) {
}
helpCommand.should.equal('test');

try {
  program.parse(['node', 'test', 'setup', '--help']);
} catch(ex) {
}
helpCommand.should.equal('setup');

try {
  program.parse(['node', 'test', 'setup', 'add', '--help']);
} catch(ex) {
}
helpCommand.should.equal('add');

try {
  program.parse(['node', 'test', 'setup', 'add', 'remote', '--help']);
} catch(ex) {
}
helpCommand.should.equal('remote');

process.exit = oldProcessExit;
exceptionOccurred.should.be.true;
