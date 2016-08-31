/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

program
  .command('sub2')
  .action( function ()  {})

// action modifies by side effect
program.parse('node aScript.js sub2 -- many extra args'.split(' '))
program.args.should.deepEqual(['sub2', 'many', 'extra', 'args'])

