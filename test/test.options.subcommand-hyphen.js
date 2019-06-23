/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .command('subcommand')
  .description('description')
  .option('-a, --alpha <a>', 'hyphen')
  .option('-b, --bravo <b>', 'hyphen')
  .option('-c, --charlie <c>', 'hyphen')
  .action(function (options) {
  });

program.parse('node test subcommand -a - --bravo - --charlie=-'.split(' '));

program.commands[0].alpha.should.equal('-');
program.commands[0].bravo.should.equal('-');
program.commands[0].charlie.should.equal('-');
