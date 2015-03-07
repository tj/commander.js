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
  info.length.should.equal(3);
  info[1].should.equal("  error: option `-c, --cheese <type>' argument missing");
  process.exit(0)
});

program
  .version('0.0.1')
  .option('-c, --cheese <type>', 'optionally specify the type of cheese');

program.parse(['node', 'test', '--cheese']);
