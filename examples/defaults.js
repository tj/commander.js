#!/usr/bin/env node

// This example shows adding default values for options.

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

function list(val) {
  return val.split(',').map(Number);
}

program
  .version('0.0.1')
  .option('-t, --template-engine [engine]', 'Add template [engine] support', 'jade')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .option('-l, --list [items]', 'Specify list items defaulting to 1,2,3', list, [1, 2, 3]);

program.parse(process.argv);

console.log('  - %s template engine', program.templateEngine);
console.log('  - %s cheese', program.cheese);
console.log('  - %j', program.list);
