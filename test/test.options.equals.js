/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('--string <n>', 'pass a string')
  .option('--string2 <n>', 'pass another string')
  .option('--num <n>', 'pass a number', Number)

program.parse('node test --string=Hello --string2 Hello=World --num=5.5'.split(' '));
program.string.should.equal('Hello');
program.string2.should.equal('Hello=World');
program.num.should.equal(5.5);
