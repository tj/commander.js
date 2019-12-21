#!/usr/bin/env node

// This is an example of useSubcommand
// and collectAllOptions
//
// try
//   $ use-subcommand journal list myjounal
//   $ use-subcommand journal delete myjounal
// or with options
//   $ use-subcommand journal -q delete -f myjounal

// const { Command } = require('commander'); << would be in a real program
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
      console.log('Quiet =', Boolean(cmdInstance.parent.parent.quiet));
      // list is a child of journal, which is a child of main cmd
      console.log('collectAllOptions:', cmdInstance.collectAllOptions());
    });
  
  journalCmd
    .command('delete <path>')
    .description('Delete journal')
    .option('-f, --force')
    .action((path, cmdInstance) => {
      console.log('List journal');
      console.log('Path is', path);
      console.log('Quiet =', Boolean(cmdInstance.parent.parent.quiet));
      console.log('Force =', Boolean(cmdInstance.force));
      console.log('collectAllOptions:', cmdInstance.collectAllOptions());
    });

  return journalCmd;
}

// this is supposedly a module, so in real case this would be `require`
const journalSubCommand = importSubCommand();

const program = new Command();
program
  .option('-q, --quiet');

program
  .command('hello <name>')
  .description('Greeting')
  .action((name, cmdInstance) => {
    console.log(`Hello ${name}!`);
  });

program
  .useSubcommand(journalSubCommand);

if (process.argv.length <= 2) {
  program.help();
} else {
  program.parse(process.argv);
}
