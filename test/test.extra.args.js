/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should')
  , programArgs = ['node', 'test', 'mycommand', 'arg0', 'arg1', 'arg2', 'arg3']
  , requiredArg
  , commandArg
  , extraArgs;

program
  .command('mycommand <id>')
  .action(function (arg0, arg1, arg2) {
    requiredArg = arg0;
    commandArg = arg1;
    extraArgs = arg2;
  });

program.parse(programArgs);

requiredArg.should.eql('arg0');
commandArg.name().should.eql('mycommand');
extraArgs.should.eql(['arg1', 'arg2', 'arg3']);
