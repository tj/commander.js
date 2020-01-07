#!/usr/bin/env node

// The original and default behaviour is that the option values are stored
// as properties on the program (Command). The action handler is passed a
// command object (Command) with the options values also stored as properties.
// This is very convenient to code, but the downside is possible clashes with
// existing properties of Command.
//
// Example output, note the issues in the first call:
//
// $ node storeOptionsAsProperties-problem.js show
// [Function]
// [Function]
//
// $ node storeOptionsAsProperties-problem.js --name foo show --action jump
// jump
// foo

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .name('my-program-name')
  .option('-n,--name <name>'); // Oops, clash with .name()

program
  .command('show')
  .option('-a,--action <action>') // Oops, clash with .action()
  .action((cmd) => {
    console.log(cmd.action);
  });

program.parse(process.argv);

console.log(program.name);
