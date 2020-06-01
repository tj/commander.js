#!/usr/bin/env node

// This is used as an example in the README for:
//    Other option types, negatable boolean
//    You can specify a boolean option long name with a leading `no-` to make it true by default and able to be negated.
//
// Example output pretending command called pizza-options (or try directly with `node options-negatable.js`)
//
// $ pizza-options
// You ordered a pizza with sauce and mozzarella cheese
// $ pizza-options --sauce
// error: unknown option '--sauce'
// $ pizza-options --cheese=blue
// You ordered a pizza with sauce and blue cheese
// $ pizza-options --no-sauce --no-cheese
// You ordered a pizza with no sauce and no cheese

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .option('--no-sauce', 'Remove sauce')
  .option('--cheese <flavour>', 'cheese flavour', 'mozzarella')
  .option('--no-cheese', 'plain with no cheese');

program.parse(process.argv);

const sauceStr = program.sauce ? 'sauce' : 'no sauce';
const cheeseStr = (program.cheese === false) ? 'no cheese' : `${program.cheese} cheese`;
console.log(`You ordered a pizza with ${sauceStr} and ${cheeseStr}`);
