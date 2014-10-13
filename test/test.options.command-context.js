/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1');

var commandContext;
var optionContext;

var setup = program.command('setup')
  .description('run setup commands for all envs')
  .action(function(env, options){
      commandContext = this;
  });

program.parse(['node', 'test', 'setup']);
commandContext._name.should.equal('setup');
