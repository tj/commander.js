/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

//can be loaded from a config file
var config = {
  pepper: true,
  cheese: false
}

program
  .version('0.0.1')
  .option('-p, --pepper [boolean]', 'add pepper', config.pepper || false)
  .option('-c, --cheese [boolean]', 'remove cheese', config.cheese || false);

program.parse(['node', 'test']);
program.pepper.should.be.true;
program.cheese.should.be.false;
