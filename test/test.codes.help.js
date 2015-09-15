/**
 * Module dependencies.
 */

var util = require('util')
  , program = require('../')
  , should = require('should');

process.on('exit', function (code) {
  code.should.equal(66);
  process.exit(0)
});

program
  .exitCode(66)
  .option('-c, --cheese <type>', 'optionally specify the type of cheese');

program.parse(['node', 'test', '-h']);
