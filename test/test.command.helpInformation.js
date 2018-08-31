var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');


program.command('somecommand');
program.command('anothercommand [options]');

var expectedHelpInformation = [
  'Usage:  [options] [command]',
  '',
  'Options:',
  '',
  '  -h, --help                output usage information',
  '',
  'Commands:',
  '',
  '  somecommand',
  '  anothercommand [options]',
  ''
].join('\n');

program.helpInformation().should.equal(expectedHelpInformation);
