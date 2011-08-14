#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('../');

program
  .version('0.0.1')
  .option('-c, --cheese <type>', 'specify cheese type')
  .parse(process.argv);

console.log('cheese: %j', program.cheese);
