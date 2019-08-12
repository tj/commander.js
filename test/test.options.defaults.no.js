/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-p, --pepper [type]', 'add pepper', 'red')
  .option('-P, --no-pepper', 'remove pepper');

program.parse(['node', 'test']);
program.pepper.should.equal('red');

program.parse(['node', 'test', '--pepper']);
program.pepper.should.equal('red');

program.parse(['node', 'test', '--pepper', 'jalapeño']);
program.pepper.should.equal('jalapeño');

program.parse(['node', 'test', '--no-pepper']);
program.pepper.should.be.false();
