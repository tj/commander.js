/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-e, --everything', 'add all of the toppings')
  .option('-p, --pepper', 'add pepper')
  .option('-P, --no-pepper', 'remove pepper')
  .option('-c|--no-cheese', 'remove cheese');

program.parse(['node', 'test']);
program.should.not.have.property('everything');
program.should.not.have.property('pepper');
program.cheese.should.be.true();

program.parse(['node', 'test', '--everything']);
program.everything.should.be.true();
program.should.not.have.property('pepper');
program.cheese.should.be.true();

program.parse(['node', 'test', '--pepper']);
program.pepper.should.be.true();
program.cheese.should.be.true();

program.parse(['node', 'test', '--everything', '--no-pepper', '--no-cheese']);
program.pepper.should.be.false();
program.cheese.should.be.false();
