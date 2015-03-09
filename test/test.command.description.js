var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');

sinon.stub(process, 'exit');
sinon.stub(process.stdout, 'write');

program
  .command('mycommand [options]', 'this is my command with\nmultiple lines in description.\nyay folks!');

program.parse(['node', 'mycommand', '--help']);

process.exit.calledOnce.should.be.true;
process.exit.calledWith(0).should.be.true;

process.stdout.write.calledOnce.should.be.true;
process.stdout.write.args.length.should.equal(1);

var output = process.stdout.write.args[0];

sinon.restore();

output[0].should.containEql([
  '    mycommand [options]  this is my command with',
  '                         multiple lines in description.',
  '                         yay folks!'
].join('\n'));
