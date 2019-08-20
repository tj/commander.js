#!/usr/bin/env node

// This is an example of forwardSubcommands
//
// $ forward-subcommands journal list myjrnl1
// $ forward-subcommands journal delete myjrnl1
//
// Also with options
// $ forward-subcommands journal -q delete -f myjrnl1


const commander = require('commander');
const program = new commander.Command();

const subCommand = program
  .command('journal')
  .description('Journal utils') // this should be separate line
  .option('-q, --quiet')
  .forwardSubcommands(); // instead of "action"

subCommand
  .command('list <path>')
  .description('List journal')
  .action((path, ci) => {
    console.log('List journal');
    console.log('Path is', path);
    console.log('Quiet =', Boolean(ci.parent.quiet));
  });

subCommand
  .command('delete <path>')
  .description('Delete journal')
  .option('-f, --force')
  .action((path, ci) => {
    console.log('List journal');
    console.log('Path is', path);
    console.log('Quiet =', Boolean(ci.parent.quiet));
    console.log('Force =', Boolean(ci.force));
  });

program.parse(process.argv);
