#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('../');

program
  .version('0.0.1')
  .usage('test')
  .option('-s --size <size>', 'Pizza size', /^(large|medium|small)$/i, 'medium')
  .option('-d --drink [drink]', 'Drink', /^(coke|pepsi|izze)$/i)
  .parse(process.argv);
  
console.log(' size: %j', program.size);
console.log(' drink: %j', program.drink);
