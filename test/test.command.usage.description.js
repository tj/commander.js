var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');

sinon.stub(process, 'exit');
sinon.stub(process.stdout, 'write');

program
  .command('cmd', 'usage doesn\'t work without description ;-(')
  .usage('[options] \\\n  | xargs send --message \'yay folks!\' \\\n  | wc -l');

program.parse(['node', 'cmd', '--help']);

process.exit.calledOnce.should.be.true;
process.exit.calledWith(0).should.be.true;

process.stdout.write.calledOnce.should.be.true;
process.stdout.write.args.length.should.equal(1);

var output = process.stdout.write.args[0];

sinon.restore();

output[0].should.containEql([
  '  Usage: cmd [options] \\',
  '           | xargs send --message \'yay folks!\' \\',
  '           | wc -l'
].join('\n'));
