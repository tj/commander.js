var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');

sinon.stub(process, 'exit');
sinon.stub(process.stdout, 'write');

program.name('foobar').description('This is a test.');

program.name.should.be.a.Function();
program.name().should.equal('foobar');
program.description().should.equal('This is a test.');

var output = process.stdout.write.args[0];

sinon.restore();
