var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');

program.help('custom help output');
program.command('somecommand');
program.command('anothercommand [options]');

var expectedHelpInformation = [
  'Usage:  [options] [command]',
  '',
  'Options:',
  '  -h, --help                custom help output',
  '',
  'Commands:',
  '  somecommand',
  '  anothercommand [options]',
  ''
].join('\n');

program.helpInformation().should.equal(expectedHelpInformation);
