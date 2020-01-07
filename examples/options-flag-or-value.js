#!/usr/bin/env node

// This is used as an example in the README for:
//    Other option types, flag|value
//    You can specify an option which functions as a flag but may also take a value (declared using square brackets).
//
// Example output pretending command called pizza-options (or try directly with `node options-flag-or-value.js`)
//
// $ pizza-options
// no cheese
// $ pizza-options --cheese
// add cheese
// $ pizza-options --cheese mozzarella
// add cheese type mozzarella

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .option('-c, --cheese [type]', 'Add cheese with optional type');

program.parse(process.argv);

if (program.cheese === undefined) console.log('no cheese');
else if (program.cheese === true) console.log('add cheese');
else console.log(`add cheese type ${program.cheese}`);
