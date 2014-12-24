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
  .option('-f, --my-fLOAT <n>', 'pass a float', parseFloat)
  .option('-m, --my-very-long-float <n>', 'pass a float', parseFloat)
  .option('-u, --my-URL-count <n>', 'pass a float', parseFloat)
  .option('-r, --my-long-range <a..b>', 'pass a range', parseRange);

program.parse('node test -i 5.5 -f 5.5 -m 6.5 -u 7.5 -n 15.99 -r 1..5'.split(' '));
program.myInt.should.equal(5);
program.myNum.should.equal(15.99);
program.myFLOAT.should.equal(5.5);
program.myVeryLongFloat.should.equal(6.5);
program.myURLCount.should.equal(7.5);
program.myLongRange.should.eql([1, 5]);
