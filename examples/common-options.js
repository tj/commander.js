#!/usr/bin/env node

// This example shows a couple of ways of adding a common option to all the subcommands.
// We are using one level of subcommands. (Adding options to just the leaf subcommands
// with deeper nesting would be a little more work.)

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo

// Common options can be added when subcommands are created by using a custom subclass.
// If the options are unsorted in the help, these will appear first.
class MyRootCommand extends Command {
  createCommand(name) {
    const cmd = new Command(name);
    cmd.option('-v, --verbose', 'use verbose logging');
    return cmd;
  }
}

const program = new MyRootCommand();

program.command('print')
  .option('--a4', 'Use A4 sized paper')
  .action((options) => {
    console.log('print options: %O', options);
  });

program.command('serve')
  .option('-p, --port <number>', 'port number for server')
  .action((options) => {
    console.log('serve options: %O', options);
  });

// Common options can be added manually after setting up program and subcommands.
// If the options are unsorted in the help, these will appear last.
program.commands.forEach((cmd) => {
  cmd.option('-d, --debug');
});

program.parse();

// Try the following:
//    node common-options.js print --help
//    node common-options.js serve --help
//    node common-options.js serve --debug --verbose
