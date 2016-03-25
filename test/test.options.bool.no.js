/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-p, --pepper', 'add pepper')
  .option('-c|--no-cheese', 'remove cheese');

program.parse(['node', 'test', '--no-cheese']);
should.equal(undefined, program._data.pepper);
program.get('pepper').should.be.false;
program.get('cheese').should.be.false;
