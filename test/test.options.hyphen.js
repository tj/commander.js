/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

function parseRange(str) {
  return str.split('..').map(Number);
}

program
  .version('0.0.1')
  .option('-a, --alpha <a>', 'hyphen')
  .option('-b, --bravo <b>', 'hyphen')
  .option('-c, --charlie <c>', 'hyphen')

program.parse('node test -a - --bravo - --charlie=- - -- -'.split(' '));
program.alpha.should.equal('-');
program.bravo.should.equal('-');
program.charlie.should.equal('-');
program.args[0].should.equal('-');
program.args[1].should.equal('-');
