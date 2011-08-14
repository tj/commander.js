#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('../');

program
  .version('0.0.1')
  .option('-p, --pepper', 'add pepper')
  .option('-C, --no-cheese', 'no cheese')
  .parse(process.argv);

console.log('cheese: %j', program.cheese);
console.log('pepper: %j', program.pepper);