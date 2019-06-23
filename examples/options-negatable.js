#!/usr/bin/env node

// This is used as an example in the README for:
//    Other option types, negatable boolean
//    You can specify a boolean option long name with a leading `no-` to make it true by default and able to be negated.
//
// Example output pretending command called pizza-options (or try directly with `node options-negatable.js`)
//
// $ pizza-options
// you ordered a pizza with sauce
// $ pizza-options --sauce
// error: unknown option '--sauce'
// $ pizza-options --no-sauce
// you ordered a pizza without sauce

const commander = require('commander');
const program = new commander.Command();

program
  .option('-n, --no-sauce', 'Remove sauce')
  .parse(process.argv);

if (program.sauce) console.log('you ordered a pizza with sauce');
else console.log('you ordered a pizza without sauce');
