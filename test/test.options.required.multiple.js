/**
 * Module dependencies.
 */

var util = require('util')
  , program = require('../')
  , should = require('should');

var info = [];

console.error = function () {
  info.push(util.format.apply(util, arguments));
};

process.on('exit', function (code) {
  code.should.equal(1);
  info.length.should.equal(5);
  info[1].should.equal("  error: missing required options");
  info[2].should.equal("    -o, --output <output> - output format");
  info[3].should.equal("    -p <path> - input path");
  process.exit(0)
});

program
  .version('0.0.1')
  .option('-o, --output <output>', 'output format')
  .option('-p <path>', 'input path')
  .option('-v [verbosity]', 'verbosity level')
  .autoCheckRequiredOptions();

debugger;
program.parse(['node', 'test']);
