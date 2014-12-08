var program = require('../')
  , should = require('should');

program
  .command('mycommand [options]', 'this is my command');

program.parse(['node', 'test']);

program.name.should.be.a.Function;
program.name().should.equal('test');
program.commands[0].name().should.equal('mycommand');
program.commands[1].name().should.equal('help');
