/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-c, --add-cheese, --addCheese, --iWantCheese', 'add cheese');

program.parse(['node', 'test', '-c']);
program.addCheese.should.be.true();

program.parse(['node', 'test', '--add-cheese']);
program.addCheese.should.be.true();

program.parse(['node', 'test', '--addCheese']);
program.addCheese.should.be.true();

program.parse(['node', 'test', '--iWantCheese']);
program.addCheese.should.be.true();
