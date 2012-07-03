/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .option('-f, --foo', 'add some foo')
  .option('-b, --bar', 'add some bar')
  .parse(process.argv);
should.equal(require('../package.json').version, program.version());

program
  .version('1.3')
  .option('-f, --foo', 'add some foo')
  .option('-b, --bar', 'add some bar')
  .parse(process.argv);
should.equal('1.3', program.version());