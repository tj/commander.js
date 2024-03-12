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
//    node alias.js --help
//    node alias.js exec script
//    node alias.js ex script
//    node alias.js print file
//    node alias.js pr file
//    node alias.js show file
