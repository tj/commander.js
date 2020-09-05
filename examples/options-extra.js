#!/usr/bin/env node

// This is used as an example in the README for extra option features.

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .addOption(new commander.Option('-s, --secret').hideHelp())
  .addOption(new commander.Option('-t, --timeout <delay>', 'timeout in seconds').default(60, 'one minute'))
  .addOption(new commander.Option('-d, --drink <size>', 'drink cup size').choices(['small', 'medium', 'large']));

program.parse();

console.log('Options: ', program.opts());

// Try the following:
//  node options-extra.js --help
//  node options-extra.js --drink huge
