import { styleText } from 'node:util'; // from node v20.12.0
import { Command } from 'commander';

// Customise colours and styles for help output.
//
// Commander looks after removing color if NO_COLOR is set
// or output stream (stdout/stderr) does not support color.

const program = new Command();

program.configureHelp({
  styleTitle: (str) => styleText('bold', str),
  styleCommandText: (str) => styleText('cyan', str),
  styleCommandDescription: (str) => styleText('magenta', str),
  styleItemDescription: (str) => styleText('italic', str),
  styleOptionText: (str) => styleText('green', str),
  styleArgumentText: (str) => styleText('yellow', str),
  styleSubcommandText: (str) => styleText('blue', str),
});

program.description('d '.repeat(100));
program.option('-s', 'short flag').option('--long <number>', 'l '.repeat(100));

program.addHelpText(
  'after',
  styleText('italic', '\nThis is additional help text.'),
);

// ToDo: use action subcommands, as more common.
// ToDo: do one subcommand with multiple arguments and include in the Try section.

program.command('esses').description('sssss '.repeat(33));

program
  .command('print')
  .description('print files')
  .argument('<files...>', 'files to queue for printing');

program.parse();

// Try the following:
//    node color-help-style.mjs --help
//    NO_COLOR=1 node color-help.mjs --help
//    node color-help-style.mjs copy --help
