#!/usr/bin/env node

// This is an example of useSubcommand
//
// $ use-subcommand journal list myjounal
// $ use-subcommand journal delete myjounal
//
// With options
// $ use-subcommand journal -q delete -f myjounal

// const { Command } = require('commander');
const { Command } = require('..');

function importSubCommand() {
  const journalCmd = new Command()
    .name('journal')
    .description('Journal utils');

  journalCmd
    .command('list <path>')
    .description('List journal')
    .action((path, cmdInstance) => {
      console.log('List journal');
      console.log('Path is', path);
      console.log('Quiet =', Boolean(cmdInstance.parent.quiet));
    });
  
  journalCmd
    .command('delete <path>')
    .description('Delete journal')
    .option('-f, --force')
    .action((path, cmdInstance) => {
      console.log('List journal');
      console.log('Path is', path);
      console.log('Quiet =', Boolean(cmdInstance.parent.quiet));
      console.log('Force =', Boolean(cmdInstance.force));
    });

  return journalCmd;
}

// this is supposedly a module, so in real case this would be `require`
const journalSubCommand = importSubCommand();

const program = new Command();
program
  .option('-q, --quiet')
  .useSubcommand(journalSubCommand);

program
  .command('hello <name>')
  .description('Greeting')
  .action((name, cmdInstance) => {
    console.log(`Hello ${name}!`);
  });

if (process.argv.length <= 2) program.help();
program.parse(process.argv);
