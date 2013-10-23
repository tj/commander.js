/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-c, --cflags <cflags>', 'pass options/flags to a compiler')
  .option('-o, --other', 'just some other option')
  .option('-x, --xother', 'just some other option')
  .option('-y, --yother', 'just some other option')
  .option('-z, --zother', 'just some other option');


program.parse(['node', 'test', '--cflags', '-DDEBUG', '-o', '-xyz']);
program.should.have.property('cflags', '-DDEBUG');
program.should.have.property('other');
program.should.have.property('xother');
program.should.have.property('yother');
program.should.have.property('zother');
