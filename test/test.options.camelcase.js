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
  .option('-i, --my-int <n>', 'pass an int', parseInt)
  .option('-n, --my-num <n>', 'pass a number', Number)
  .option('-f, --my-float <n>', 'pass a float', parseFloat)
  .option('-r, --my-range <a..b>', 'pass a range', parseRange);

program.parse('node test -i 5.5 -f 5.5 -n 15.99 -r 1..5'.split(' '));
program.myInt.should.equal(5);
program.myNum.should.equal(15.99);
program.myFloat.should.equal(5.5);
program.myRange.should.eql([1,5]);
