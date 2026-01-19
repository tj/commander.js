#!/usr/bin/env node

// This is used as an example in the README for extra option features.
// See also options-env.js for more extensive env examples,
// and options-conflicts.js for more details about .conflicts().

import { Command, Option } from 'commander';
const program = new Command();

program
  .addOption(new Option('-s, --secret').hideHelp())
  .addOption(
    new Option('-t, --timeout <delay>', 'timeout in seconds').default(
      60,
      'one minute',
    ),
  )
  .addOption(
    new Option('-d, --drink <size>', 'drink cup size').choices([
      'small',
      'medium',
      'large',
    ]),
  )
  .addOption(new Option('-p, --port <number>', 'port number').env('PORT'))
  .addOption(
    new Option('--donate [amount]', 'optional donation in dollars')
      .preset('20')
      .argParser(parseFloat),
  )
  .addOption(
    new Option('--disable-server', 'disables the server').conflicts('port'),
  )
  .addOption(
    new Option('--free-drink', 'small drink included free ').implies({
      drink: 'small',
    }),
  );

program.parse();

console.log('Options: ', program.opts());

// Try the following:
//    node options-extra.mjs --help
//    node options-extra.mjs --drink huge
//    node options-extra.mjs --free-drink
//    PORT=80 node options-extra.mjs
//    node options-extra.mjs --donate
//    node options-extra.mjs --donate 30.50
//    node options-extra.mjs --disable-server --port 8000
