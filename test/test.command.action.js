var program = require('../')
  , should = require('should');

var val = false;
program
  .command('info [options]')
  .option('-C, --no-color', 'turn off color output')
  .action(function () {
    val = this.get('color');
  });

program.parse(['node', 'test', 'info']);
program.commands[0].get('color').should.equal(val);
