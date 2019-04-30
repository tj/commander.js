/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

var val = "some cheese"
program
  .name('test')
  .command('mycommand')
  .option('-c, --cheese [type]', 'optionally specify the type of cheese')
  .action(function(cmd) {
    val = cmd.cheese;
  });

program.parse(['node', 'test', 'mycommand', '--cheese', '']);

val.should.equal('');

