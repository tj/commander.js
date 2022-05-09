#!/usr/bin/env node
// const { Command, Option } = require('commander'); // (normal include)
const { Command, Option } = require('../'); // include commander in git clone of commander repo
const program = new Command();

// You can use .conflicts() with a single string, which is the camel-case name of the conflicting option.
program
  .addOption(new Option('--quiet').implies({ logLevel: 'off' }))
  .addOption(new Option('--log-level <level>').choices(['info', 'warning', 'error', 'off']).default('info'))
  .addOption(new Option('-c, --cheese <type>', 'Add the specified type of cheese').implies({ dairy: true }))
  .addOption(new Option('--no-cheese', 'You do not want any cheese').implies({ dairy: false }))
  .addOption(new Option('--dairy', 'May contain dairy'));

program.parse();
console.log(program.opts());

// Try the following:
//    node options-implies.js
//    node options-implies.js --quiet
//    node options-implies.js --log-level=warning --quiet
//    node options-implies.js --cheese=cheddar
//    node options-implies.js --no-cheese
