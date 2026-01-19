#!/usr/bin/env node

// This is used as an example in the README for extra argument features.

import { Command, Argument } from 'commander';
const program = new Command();

program
  .addArgument(
    new Argument('<drink-size>', 'drink cup size').choices([
      'small',
      'medium',
      'large',
    ]),
  )
  .addArgument(
    new Argument('[timeout]', 'timeout in seconds').default(60, 'one minute'),
  )
  .action((drinkSize, timeout) => {
    console.log(`Drink size: ${drinkSize}`);
    console.log(`Timeout (s): ${timeout}`);
  });

program.parse();

// Try the following:
//    node arguments-extra.mjs --help
//    node arguments-extra.mjs huge
//    node arguments-extra.mjs small
//    node arguments-extra.mjs medium 30
