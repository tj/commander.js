#!/usr/bin/env node

// This is used as an example in the README for variadic options.

import { Command } from 'commander';
const program = new Command();

program
  .option('-n, --number <value...>', 'specify numbers')
  .option('-l, --letter [value...]', 'specify letters');

program.parse();

console.log('Options: ', program.opts());
console.log('Remaining arguments: ', program.args);

// Try the following:
//    node options-variadic.mjs -n 1 2 3 --letter a b c
//    node options-variadic.mjs --letter=A -n80 operand
//    node options-variadic.mjs --letter -n 1 -n 2 3 -- operand
