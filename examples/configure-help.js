// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo

const program = new commander.Command();

// This example shows a simple use of configureHelp.
// This is used as an example in the README.

program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: (cmd) => cmd.name() // Just show the name, instead of short usage.
});

program.command('zebra <herd-size>', 'African equines with distinctive black-and-white striped coats');
program.command('aardvark [colour]', 'medium-sized, burrowing, nocturnal mammal');
program
  .command('beaver', 'large, semiaquatic rodent')
  .option('--pond')
  .option('--river');

program.parse();

// Try the following:
// node configure-help.js --help
