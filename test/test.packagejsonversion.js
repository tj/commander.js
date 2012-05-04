/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version(program.packageVersion('1.3'))
  .option('-f, --foo', 'add some foo')
  .option('-b, --bar', 'add some bar');

should.equal(program.packageVersion(), program.version());

program
  .version(program.packageVersion('1.3', '../test.json'))
  .option('-f, --foo', 'add some foo')
  .option('-b, --bar', 'add some bar');
should.equal('1.3', program.version());