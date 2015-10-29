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
  info.length.should.equal(4);
  info[1].should.equal("  error: missing required option");
  info[2].should.equal("    -o, --output <output> - output format");
  process.exit(0)
});

program
  .version('0.0.1')
  .option('-o, --output <output>', 'output format')
  .autoCheckRequiredOptions();

program.parse(['node', 'test']);
