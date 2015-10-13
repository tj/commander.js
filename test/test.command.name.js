var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');

sinon.stub(process, 'exit');
sinon.stub(process.stdout, 'write');

program
  .command('mycommand [options]', 'this is my command');

program.parse(['node', 'test']);

program.name.should.be.a.Function;
program.name().should.equal('test');
program.commands[0].name().should.equal('mycommand');
program.commands[1].name().should.equal('help');

var output = process.stdout.write.args[0];

output[0].should.containEql([
  '    mycommand [options]  this is my command'
].join('\n'));

sinon.restore();