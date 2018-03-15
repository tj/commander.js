var program = require('../')
  , should = require('should');

program
  .command('info [thing]')
  .alias('i')
  .action(function () {
  });

program
  .command('save [file]')
  .alias('s')
  .action(function() {
  });

program.parse(['node', 'test']);

program._printer.commandHelp(program).should.containEql('info|i');
program._printer.commandHelp(program).should.containEql('save|s');
program._printer.commandHelp(program).should.not.containEql('test|');
