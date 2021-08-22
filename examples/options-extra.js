#!/usr/bin/env node

// This is used as an example in the README for extra option features.
// See also options-env.js for more extensive env examples.

// const { Command, Option } = require('commander'); // (normal include)
const { Command, Option } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .addOption(new Option('-s, --secret').hideHelp())
  .addOption(new Option('-t, --timeout <delay>', 'timeout in seconds').default(60, 'one minute'))
  .addOption(new Option('-d, --drink <size>', 'drink cup size').choices(['small', 'medium', 'large']))
  .addOption(new Option('-p, --port <number>', 'port number').env('PORT'));

program.parse();

console.log('Options: ', program.opts());

// Try the following:
// node options-extra.js --help
// node options-extra.js --drink huge
// PORT=80 node options-extra.js
