var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');

program.version('1.0.0', undefined, 'custom version output');
program.command('somecommand');
program.command('anothercommand [options]');

var expectedHelpInformation = [
  'Usage:  [options] [command]',
  '',
  'Options:',
  '  -V, --version             custom version output',
  '  -h, --help                output usage information',
  '',
  'Commands:',
  '  somecommand',
  '  anothercommand [options]',
  ''
].join('\n');

program.helpInformation().should.equal(expectedHelpInformation);
