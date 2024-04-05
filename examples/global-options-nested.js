#!/usr/bin/env node

// This example shows global options on the program which affect all the subcommands.
// See how to work with global options in the subcommand and display them in the help.
//
// (A different pattern for a "global" option is to add it to the subcommands, rather
// than to the program. See global-options-added.js.)

const { Command } = require('commander');
const program = new Command();

program.configureHelp({ showGlobalOptions: true }).option('-g, --global');

program
  .command('sub')
  .option('-l, --local')
  .action((options, cmd) => {
    console.log({
      opts: cmd.opts(),
      optsWithGlobals: cmd.optsWithGlobals(),
    });
  });

program.parse();

// Try the following:
//    node global-options-nested.js --global sub --local
//    node global-options-nested.js sub --help
