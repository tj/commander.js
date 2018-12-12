var program = require('../')
  , sinon = require('sinon')
  , should = require('should');

sinon.stub(process, 'exit');
sinon.stub(process.stdout, 'write');

var stubError = sinon.stub(console, 'error');

var cmd = 'my_command', invalidCmd = 'invalid_command';

program.command(cmd, 'description');

program.parse(['node', 'test', invalidCmd]);

stubError.callCount.should.equal(1);

sinon.restore();

