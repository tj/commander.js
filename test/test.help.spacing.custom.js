var program = require('../')
  , should = require('should');

program.Command.SPACING = ''

program
  .name('test')
  .description('test cli')
  .option('--sauce <type>', 'type of sauce')
  .command('bake <style>')
  .action(function () {
  });

var helpLines = program.helpInformation().split('\n')

helpLines[1].should.containEql('  Usage: test [options] [command]')
helpLines[3].should.containEql('  test cli')
helpLines[5].should.containEql('  Options:')
helpLines[6].should.containEql('    --sauce <type>  type of sauce')
helpLines[9].should.containEql('  Commands:')
helpLines[10].should.containEql('    bake <style>')
