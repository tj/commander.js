var program = require('../')
  , util = require('util')
  , should = require('should');

var oldError = console.error;
var err;
console.error = function (tpl, s) {
  err = util.format(tpl, s);
};
program
  .command('exec [options]', 'this is my command');

program.parse('node test exec a'.split(' '));

process.nextTick(function () {
  err.should.equal('\n  test-exec(1) does not exist, try --help\n');
});

console.error = oldError;

