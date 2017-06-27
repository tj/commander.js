/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .arguments('<req> [opt]')
  .option('-p, --pepper', 'add pepper')
  .option('-c|--no-cheese', 'remove cheese')
  .action(function(req, opt) {
    myreq = req;
    myopt = opt
  });

program.parse(['node', 'test', 'foo', 'baz', '--no-cheese']);
should.equal(undefined, program.pepper);
program.cheese.should.be.false;
myreq.should.equal('foo');
myopt.should.equal('baz');

program.reset();

program.parse(['node', 'test', 'bar', '-p']);
program.pepper.should.be.true
should.equal(undefined, program.cheese);
myreq.should.equal('bar');
should.equal(undefined, myopt);
