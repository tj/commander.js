#!/usr/bin/env node

// This is used as an example in the README for:
//    Default option value
//    You can specify a default value for an option which takes a value.
//
// Example output pretending command called pizza-options (or try directly with `node options-defaults.js`)
//
// $ pizza-options
// cheese: blue
// $ pizza-options --cheese stilton
// cheese: stilton

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .option('-c, --cheese <type>', 'Add the specified type of cheese', 'blue');

program.parse(process.argv);

console.log(`cheese: ${program.cheese}`);
