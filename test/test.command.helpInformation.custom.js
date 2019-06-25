var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');

sinon.stub(process, 'exit');
sinon.stub(process.stdout, 'write');

program.helpOption('-c, --HELP', 'custom help output');
program.command('somecommand');
program.command('anothercommand [options]');

var expectedHelpInformation = [
  'Usage:  [options] [command]',
  '',
  'Options:',
  '  -c, --HELP                custom help output',
  '',
  'Commands:',
  '  somecommand',
  '  anothercommand [options]',
  ''
].join('\n');

program.helpInformation().should.equal(expectedHelpInformation);

// Test arguments
var expectedCommandHelpInformation = [
  'Usage: test [options] [command]',
  '',
  'Options:',
  '  -c, --HELP                custom help output',
  '',
  'Commands:',
  '  somecommand',
  '  anothercommand [options]',
  ''
].join('\n');

program.parse(['node', 'test', '--HELP']);

process.stdout.write.called.should.equal(true);

var output = process.stdout.write.args[0];
output[0].should.equal(expectedCommandHelpInformation);

sinon.restore();
