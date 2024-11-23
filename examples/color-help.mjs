import { styleText } from 'node:util'; // from node v20.12.0
import { Command } from 'commander';

// Customise colours and styles for help output.

const program = new Command();

program.configureHelp({
  styleTitle: (str) => styleText('bold', str),
  styleCommandText: (str) => styleText('cyan', str),
  styleCommandDescription: (str) => styleText('magenta', str),
  styleDescriptionText: (str) => styleText('italic', str),
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
  .argument('<files...>', 'files to queue for printing')
  .option('--double-sided', 'print on both sides');

program.parse();

// Try the following:
//    node color-help.mjs --help
//    NO_COLOR=1 node color-help.mjs --help
//    node color-help.mjs help print
