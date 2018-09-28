var program = require('../')
	, sinon = require('sinon').sandbox.create()
  , should = require('should');

sinon.stub(process, 'exit');
sinon.stub(process.stdout, 'write');

program
  .helpDescription('My custom help description')

program.parse(['node', 'test']);

program._helpDescription.should.equal('My custom help description');

sinon.restore();
sinon.stub(process.stdout, 'write');
program.outputHelp();

var output = process.stdout.write.args[0];

output[0].should.equal('Usage: test [options]\n\nOptions:\n  -h, --help  My custom help description\n');
