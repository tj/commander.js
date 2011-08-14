/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

function parseRange(str) {
  return str.split('..').map(Number);
}

program
  .version('0.0.1')
  .option('-i, --int <n>', 'pass an int', parseInt)
  .option('-n, --num <n>', 'pass a number', Number)
  .option('-f, --float <n>', 'pass a float', parseFloat)
  .option('-r, --range <a..b>', 'pass a range', parseRange);

program.parse('node test -i 5.5 -f 5.5 -n 15.99 -r 1..5'.split(' '));
program.int.should.equal(5);
program.num.should.equal(15.99);
program.float.should.equal(5.5);
program.range.should.eql([1,5]);
