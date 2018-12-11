var program = require('../')
  , sinon = require('sinon')
  , should = require('should');

sinon.stub(process, 'exit');
sinon.stub(process.stdout, 'write');

var cmd = 'my_command', invalidCmd = 'invalid_command';

program.command(cmd, 'description...');

program.parse(['node', 'test', invalidCmd]);

var output = process.stdout.write.args[0];
output[0].should.equal('error: unknown command:  ' + invalidCmd + '\n');

sinon.restore();

