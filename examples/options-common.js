#!/usr/bin/env node

// This is used as an example in the README for:
//    Common option types, boolean and value
//    The two most used option types are a boolean flag, and an option which takes a value (declared using angle brackets).
//
// Example output pretending command called pizza-options (or try directly with `node options-common.js`)
//
// $ pizza-options -d
// { debug: true, small: undefined, pizzaType: undefined }
// pizza details:
// $ pizza-options -p
// error: option '-p, --pizza-type <type>' argument missing
// $ pizza-options -ds -p vegetarian
// { debug: true, small: true, pizzaType: 'vegetarian' }
// pizza details:
// - small pizza size
// - vegetarian
// $ pizza-options --pizza-type=cheese
// pizza details:
// - cheese

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);

if (program.debug) console.log(program.opts());
console.log('pizza details:');
if (program.small) console.log('- small pizza size');
if (program.pizzaType) console.log(`- ${program.pizzaType}`);
