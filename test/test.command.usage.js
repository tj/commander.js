var program = require('../')
  , should = require('should');

program
  .name('test')
  .command('info [options]')

program.commands[0].helpInformation().should.startWith('Usage: test info [options]')
