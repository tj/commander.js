var program = require('../')
  , sinon = require('sinon')
  , should = require('should');

sinon.stub(process, 'exit');
sinon.stub(process.stdout, 'write');

var stubError = sinon.stub(console, 'error');

var cmd = 'my_command';

program.command(cmd, 'description');

program.parse(['node', 'test', cmd]);

stubError.callCount.should.equal(0);
var output = process.stdout.write.args;
output.should.deepEqual([]);

sinon.restore();

