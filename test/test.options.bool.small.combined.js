/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-p, --pepper', 'add pepper')
  .option('-c, --no-cheese', 'remove cheese');

program.parse(['node', 'test', '-pc']);
program.get('pepper').should.be.true;
program.get('cheese').should.be.false;
