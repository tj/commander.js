#!/usr/bin/env node

// This example shows a couple of ways to add a "global" option to all of the subcommands.
// The first approach is to use a subclass and add the option as the subcommand is created.
// The second approach is to loop over the subcommands after they have been created.
//
// The code in this example assumes there is just one level of subcommands.
//
// (A different pattern for a "global" option is to add it to the root command, rather
// than to the subcommand. That is not shown here.)

// const { Command, createOption } = require('commander'); // (normal include)
const { Command, createOption } = require('../'); // include commander in git clone of commander repo

// Common options can be added when subcommands are created by using a custom subclass.
// If the options are unsorted in the help, these will appear first.
class MyRootCommand extends Command {
  createCommand(name) {
    // use MyRootCommand to add --verbose to any sub-subcommands like "print pdf"
    const cmd = new MyRootCommand(name);
    cmd.option('-v, --verbose', 'use verbose logging');
    return cmd;
  }
}

// enablePositionalOptions makes --verbose and --a4 available to "print pdf"
const program = new MyRootCommand().enablePositionalOptions();

const commonPrintOptions = createOption('--a4', 'Use A4 sized paper');

const print = program.command('print')
  .addOption(commonPrintOptions)
  .action((options) => {
    console.log('print options: %O', options);
  });

print.command('pdf')
  .addOption(commonPrintOptions)
  .action((options) => {
    console.log('print pdf options: %O', options);
  });

  program.command('serve')
  .option('-p, --port <number>', 'port number for server')
  .action((options) => {
    console.log('serve options: %O', options);
  });

// Common options can be added manually after setting up program and subcommands.
// If the options are unsorted in the help, these will appear last.
program.commands.forEach(addDebug);

function addDebug(cmd) {
  cmd.option('-d, --debug');
  // recurse to add --debug to any sub-subcommands like "print pdf"
  cmd.commands.forEach(addDebug);
}

program.parse();

// Try the following:
//    node global-options.js --help
//    node global-options.js print --help
//    node global-options.js print pdf --help
//    node global-options.js serve --help
//    node global-options.js serve --debug --verbose
//    node global-options.js print -d -v --a4
//    node global-options.js print pdf -d -v --a4
