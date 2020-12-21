#!/usr/bin/env node

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo

// Use a class override to customise the command and its subcommands.
//
// Configuring the command for compatibility with Commander v6 defaults behaviours.

class Command6 extends commander.Command {
  constructor(name) {
    super(name);

    // Revert to Commander v6 behaviours.
    this.storeOptionsAsProperties();
    this.allowExcessArguments();
  }

  createCommand(name) {
    return new Command6(name);
  }
};

function inspectCommand(command, optionName) {
  // The option value is stored as property on command because we called .storeOptionsAsProperties()
  console.log(`Inspecting '${command.name()}'`);
  console.log(`option '${optionName}': ${command[optionName]}`);
  console.log(`args: ${command.args}`);
};

const program = new Command6('program')
  .option('-p, --port <number>')
  .action(() => {
    inspectCommand(program, 'port');
  });

program
  .command('sub')
  .option('-d, --debug')
  .action((options, command) => {
    inspectCommand(command, 'debug');
  });

program.parse();

// We can pass excess arguments without an error as we called .allowExcessArguments()
//
// Try the following:
//    node custom-command-class.js --port 80 extra arguments
//    node custom-command-class.js sub --debug extra arguments
