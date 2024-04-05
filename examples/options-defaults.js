#!/usr/bin/env node

// This is used as an example in the README for:
//    Default option value

const commander = require('commander');
const program = new commander.Command();

program.option(
  '-c, --cheese <type>',
  'Add the specified type of cheese',
  'blue',
);

program.parse();

console.log(`cheese: ${program.opts().cheese}`);

// Try the following:
//    node options-defaults.js
//    node options-defaults.js --cheese stilton
