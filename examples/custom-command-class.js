#!/usr/bin/env node

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo

// Use a class override to customise the command and its subcommands.

class CommandWithTrace extends commander.Command {
  createCommand(name) {
    const cmd = new CommandWithTrace(name);
    // Add an option to subcommands created using `.command()`
    cmd.option('-t, --trace', 'display extra information when run command');
    return cmd;
  }
};

function inpectCommand(command) {
  // The option value is stored as property on command because we called .storeOptionsAsProperties()
  console.log(`Called '${command.name()}'`);
  console.log(`args: ${command.args}`);
  console.log('opts: %o', command.opts());
};

const program = new CommandWithTrace('program')
  .option('-v, ---verbose')
  .action((options, command) => {
    inpectCommand(command);
  });

program
  .command('serve [params...]')
  .option('-p, --port <number>', 'port number')
  .action((params, options, command) => {
    inpectCommand(command);
  });

program
  .command('build <target>')
  .action((buildTarget, options, command) => {
    inpectCommand(command);
  });

program.parse();

// Try the following:
//    node custom-command-class.js --help
//    node custom-command-class.js serve --help
//    node custom-command-class.js serve -t -p 80 a b c
//    node custom-command-class.js build --help
//    node custom-command-class.js build --trace foo
