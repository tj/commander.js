var program = require('../')
  , should = require('should');

program
    .version('0.0.1')
    .command('create <type> <name>', 'testdesc')
    .action(function (type, name) {
        // some code
    });

program.parse(['node', 'test']);

program.name.should.be.a.Function;
program.name().should.equal('test');
program.commands[0].name().should.equal('create');
program.commands[0].description().should.equal('testdesc');
program.commands[0].parent.should.ok;
program.commands[1].name().should.equal('help');
