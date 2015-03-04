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

program.parse(['node', 'test', '--pepper', 'false', '--cheese', 'true']);
program.pepper.should.be.false;
program.cheese.should.be.true;
