#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('../');

program
  .option('-f, --food [item]', 'Provide your favourite food item')
	.version('0.0.1', '-v, --version', 'Display version number')
	.helpDescription('Display this help message')
  .parse(process.argv);

/**
 * Default behaviour
 */

// program
//   .option('-f, --food [item]', 'Provide your favourite food item')
// 	.version('0.0.1')
//   .parse(process.argv);

console.log('Oh, so you like ' + program.food + '!')
