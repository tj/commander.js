/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-f, --foo', 'add some foo')
  .option('-b, --bar', 'add some bar');

program.parse(['node', 'test', '--foo', '--', '--bar', 'baz']);
program.get('foo').should.be.true;
should.equal(undefined, program._data.bar);
program.get('bar').should.be.false;
program.args.should.eql(['--bar', 'baz']);
