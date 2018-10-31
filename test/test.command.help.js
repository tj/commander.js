var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');

program.command('bare');

program._printer.commandHelp(program).should.equal('Commands:\n  bare\n');

program.command('mycommand [options]');

program._printer.commandHelp(program).should.equal('Commands:\n  bare\n  mycommand [options]\n');
