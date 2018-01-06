var program = require('../')
  , should = require('should');

program
  .name('test')
  .option('--sauce <type>', 'type of sauce')
  .command('bake <style>')
  .action(function () {
  });

var helpLines = program.helpInformation().split('\n')

helpLines.should.containEql('  Usage: test [options] [command]')
helpLines.should.containEql('  Options:')
helpLines.should.containEql('    --sauce <type>  type of sauce')
helpLines.should.containEql('  Commands:')
helpLines.should.containEql('    bake <style>')
