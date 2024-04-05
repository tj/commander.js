#!/usr/bin/env node

// This is used as an example in the README for:
//    Required option
//    You may specify a required (mandatory) option using `.requiredOption`.
//    The option must be specified on the command line, or by having a default value.

const commander = require('commander');
const program = new commander.Command();

program.requiredOption('-c, --cheese <type>', 'pizza must have cheese');

program.parse();

console.log(`Cheese type: ${program.opts().cheese}`);

// Try the following:
//    node options-required.js
//    node options-required.js --cheese blue
