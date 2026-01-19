#!/usr/bin/env node
import { Command, Option } from 'commander';
const program = new Command();

program
  .addOption(new Option('--quiet').implies({ logLevel: 'off' }))
  .addOption(
    new Option('--log-level <level>')
      .choices(['info', 'warning', 'error', 'off'])
      .default('info'),
  )
  .addOption(
    new Option(
      '-c, --cheese <type>',
      'Add the specified type of cheese',
    ).implies({ dairy: true }),
  )
  .addOption(
    new Option('--no-cheese', 'You do not want any cheese').implies({
      dairy: false,
    }),
  )
  .addOption(new Option('--dairy', 'May contain dairy'));

program.parse();
console.log(program.opts());

// Try the following:
//    node options-implies.mjs
//    node options-implies.mjs --quiet
//    node options-implies.mjs --log-level=warning --quiet
//    node options-implies.mjs --cheese=cheddar
//    node options-implies.mjs --no-cheese
