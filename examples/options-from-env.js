#!/usr/bin/env node

// This is used as an example in the README for:
//    Environment variables and options
//
// Example output pretending command called pizza-options (or try directly with `node options-from-env.js`)
//
// $ DEBUG_LEVEL=verbose pizza-options
// { DEBUG_LEVEL: 'verbose', small: undefined, pizzaType: undefined }
// pizza details:
// $ pizza-options -p
// error: option '-p, --pizza-type <type>, env:FAVOURITE_PIZZA' argument missing
// $ DEBUG_LEVEL=info pizza-options -s -p vegetarian
// { DEBUG_LEVEL=info, small: true, pizzaType: 'vegetarian' }
// pizza details:
// - small pizza size
// - vegetarian
// $ FAVOURITE_PIZZA=pepperoni pizza-options --small
// pizza details:
// - small pizza size
// - pepperoni
// $ FAVOURITE_PIZZA=pepperoni pizza-options -s -p cheese
// pizza details:
// - small pizza size
// - cheese

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  // environment variables can be declared alone
  .option('env:DEBUG_LEVEL', 'debug level from environment')
  .option('-s, --small', 'small pizza size')
  // environment variables are more interesting when they relate to a command line option
  .option('-p, --pizza-type <type>, env:FAVOURITE_PIZZA', 'flavour of pizza');

program.parse(process.argv);

if (program.DEBUG_LEVEL) console.log(program.opts());
console.log('pizza details:');
if (program.small) console.log('- small pizza size');
if (program.pizzaType) console.log(`- ${program.pizzaType}`);
