
/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-p, --pepper', 'add pepper')
  .option('-c, --no-cheese', 'remove cheese');

program.parse(['node', 'test', '--pepper']);
program.pepper.should.be.true;
program.cheese.should.be.true;

program.options.pepper.should.be.true;
program.options.cheese.should.be.true;
