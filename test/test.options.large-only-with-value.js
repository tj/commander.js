/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('--longflag [value]', 'A long only flag with a value');

program.parse(['node', 'test', '--longflag', 'something']);
program.longflag.should.equal('something');
