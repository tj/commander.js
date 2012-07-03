/**
 * Module dependencies.
 */

// var program = require('../')
//   , should = require('should');

// program
//   .option('-f, --foo', 'add some foo')
//   .option('-b, --bar', 'add some bar');

// should.equal(require('../package.json').version, program.version());
// var program2 = require('../');
// program2
//   .version('1.3')
//   .option('-f, --foo', 'add some foo')
//   .option('-b, --bar', 'add some bar');
// should.equal('1.3', program2.version());

var program3 = require('../');
program3
  .version('1.3')
  .option('-f, --foo', 'add some foo')
  .option('-b, --bar', 'add some bar');
// should.equal('1.3', program3.version());