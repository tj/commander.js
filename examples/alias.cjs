#!/usr/bin/env node

// This example shows giving alternative names for a command.

const { Command } = require('commander');
const program = new Command();

program
  .command('exec')
  .argument('<script>')
  .alias('ex')
  .action((script) => {
    console.log(`execute: ${script}`);
  });

program
  .command('print')
  .argument('<file>')
  // Multiple aliases is unusual but supported! You can call alias multiple times,
  // and/or add multiple aliases at once. Only the first alias is displayed in the help.
  .alias('p')
  .alias('pr')
  .aliases(['display', 'show'])
  .action((file) => {
    console.log(`print: ${file}`);
  });

program.parse();

// Try the following:
//    node alias.cjs --help
//    node alias.cjs exec script
//    node alias.cjs ex script
//    node alias.cjs print file
//    node alias.cjs pr file
//    node alias.cjs show file
