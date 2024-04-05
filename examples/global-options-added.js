#!/usr/bin/env node

// This example shows a couple of ways to add a "global" option to all of the subcommands.
// The first approach is to use a subclass and add the option as the subcommand is created.
// The second approach is to loop over the subcommands after they have been created.
//
// The code in this example assumes there is just one level of subcommands.
//
// (A different pattern for a "global" option is to add it to the root command, rather
// than to the subcommand. See global-options-nested.js.)

const { Command } = require('commander');

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

program
  .command('print')
  .option('--a4', 'Use A4 sized paper')
  .action((options) => {
    console.log('print options: %O', options);
  });

program
  .command('serve')
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
//    node global-options-added.js --help
//    node global-options-added.js print --help
//    node global-options-added.js serve --help
//    node global-options-added.js serve --debug --verbose
