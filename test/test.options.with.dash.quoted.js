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
  .option('-d, --donuts [num]', -10)
  .option('-a, --eater <person>', 'Sally Sue')

program.parse('node test -d "-8,2,2.32" -a Richard'.split(' '));
program.donuts.should.equal('"-8,2,2.32"');
program.eater.should.equal('Richard');
