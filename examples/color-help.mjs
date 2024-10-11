import { styleText } from 'node:util'; // from node v20.12.0
import { Command } from 'commander';

// Customise colours and styles for help output.

const program = new Command();

program.configureHelp({
  subcommandTerm: (cmd) => cmd.name(), // keep it simple, just show the subcommand name
  styleTitle: (str) => styleText('bold', str),
  styleCommandText: (str) => styleText('cyan', str),
  styleCommandDescription: (str) => styleText('magenta', str),
  styleItemDescription: (str) => styleText('italic', str),
  styleOptionText: (str) => styleText('green', str),
  styleArgumentText: (str) => styleText('yellow', str),
  styleSubcommandText: (str) => styleText('blue', str),
});

program.description('program description '.repeat(10));
program
  .option('-s', 'short description')
  .option('--long <number>', 'long description '.repeat(10));

program.addHelpText(
  'after',
  styleText('italic', '\nThis is additional help text.'),
);

program.command('esses').description('sssss '.repeat(33));

program
  .command('print')
  .description('print files')
  .argument('<printer>', 'target printer')
  .argument('<files...>', 'files to queue for printing');

program.parse();

// Try the following:
//    node color-help.mjs --help
//    NO_COLOR=1 node color-help.mjs --help
//    node color-help.mjs help print
