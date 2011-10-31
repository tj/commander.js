/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('--verbose', 'do stuff');

program.parse(['node', 'test', '--verbose']);
program.verbose.should.be.true;
