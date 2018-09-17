var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');


program.command('bare');

program.commandHelp().should.equal('Commands:\n  bare\n');

program.command('mycommand [options]');

program.commandHelp().should.equal('Commands:\n  bare\n  mycommand [options]\n');
