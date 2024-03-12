#!/usr/bin/env node

// This is used as an example in the README for:
//    Common option types, boolean and value

const commander = require('commander');
const program = new commander.Command();

program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);

const options = program.opts();
if (options.debug) console.log(options);
console.log('pizza details:');
if (options.small) console.log('- small pizza size');
if (options.pizzaType) console.log(`- ${options.pizzaType}`);

// Try the following:
//    node options-common.js -p
//    node options-common.js -d -s -p vegetarian
//    node options-common.js --pizza-type=cheese
