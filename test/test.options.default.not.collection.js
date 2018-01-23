/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-i, --int [n]', 'optionally specify the type of cheese provide a false default', parseInt, 2)
  .option('-d, --data [n]', 'optionally specify the type of cheese provide a false default', parseInt, 4);

program.parse(['node', 'test', '--int', '20', '-d', '30']);
program.int.should.be.equal(20);
program.data.should.be.equal(30);
