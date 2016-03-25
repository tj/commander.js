/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .option('-a, --alpha <a>', 'hyphen')
  .option('-b, --bravo <b>', 'hyphen')
  .option('-c, --charlie <c>', 'hyphen')

program.parse('node test -a - --bravo - --charlie=- - -- - -t1'.split(' '));
program.get('alpha').should.equal('-');
program.get('bravo').should.equal('-');
program.get('charlie').should.equal('-');
program.args[0].should.equal('-');
program.args[1].should.equal('-');
program.args[2].should.equal('-t1');
