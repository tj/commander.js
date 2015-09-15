/**
 * Module dependencies.
 */

var util = require('util')
  , program = require('../')
  , should = require('should');

process.on('exit', function (code) {
  code.should.equal(1);
  process.exit(0)
});

program
  .exitCode(65)
  .arguments('<cmd...> [env]')
  .action(function(cmd, env){});
program.parse(['node', 'test', 'foo']);
