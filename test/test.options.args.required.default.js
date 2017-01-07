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

program
  .version('0.0.1')
  .option('-c, --cheese <type>', 'optionally specify the type of cheese', 'feta');

program.parse(['node', 'test', '--cheese']);
