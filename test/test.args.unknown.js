/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')

var failOnUnkown = false;
try {
  program.parse(['node', 'test', '--unknown'], {failOnUnknown: false});
} catch (e) {
  failOnUnkown = true;
}
failOnUnkown.should.be.false;

