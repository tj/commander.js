/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('--string <n>', 'pass a string')
  .option('--num <n>', 'pass a number', Number)

program.parse('node test --string=Hello --num=5.5'.split(' '));
program.string.should.equal('Hello');
program.num.should.equal(5.5);
