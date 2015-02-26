/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('--string <n>', 'pass a string')

program.parse('node test string --string myString'.split(' '));
program.string.should.equal('myString');
program.args.should.containEql('string');
