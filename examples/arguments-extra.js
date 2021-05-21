#!/usr/bin/env node

// This is used as an example in the README for extra argument features.

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .addArgument(new commander.Argument('<drink-size>', 'drink cup size').choices(['small', 'medium', 'large']))
  .addArgument(new commander.Argument('[timeout]', 'timeout in seconds').default(60, 'one minute'))
  .action((drinkSize, timeout) => {
    console.log(`Drink size: ${drinkSize}`);
    console.log(`Timeout (s): ${timeout}`);
  });

program.parse();

// Try the following:
//  node arguments-extra.js --help
//  node arguments-extra.js huge
//  node arguments-extra.js small
//  node arguments-extra.js medium 30
