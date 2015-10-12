var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');


program.command('mycommand [options]');

program.parse(['node', 'test']);

program.commandHelp().should.equal('\n  Commands:\n\n    mycommand [options]\n');
