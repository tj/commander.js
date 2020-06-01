#!/usr/bin/env node

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

// Commander supports nested subcommands.
// .command() can add a subcommand with an action handler or an executable.
// .addCommand() adds a prepared command with an action handler.

// Example output:
//
// $ node nestedCommands.js brew tea
// brew tea
// $ node nestedCommands.js heat jug
// heat jug

// Add nested commands using `.command()`.
const brew = program.command('brew');
brew
  .command('tea')
  .action(() => {
    console.log('brew tea');
  });
brew
  .command('coffee')
  .action(() => {
    console.log('brew coffee');
  });

// Add nested commands using `.addCommand().
// The command could be created separately in another module.
function makeHeatCommand() {
  const heat = new commander.Command('heat');
  heat
    .command('jug')
    .action(() => {
      console.log('heat jug');
    });
  heat
    .command('pot')
    .action(() => {
      console.log('heat pot');
    });
  return heat;
}
program.addCommand(makeHeatCommand());

program.parse(process.argv);
