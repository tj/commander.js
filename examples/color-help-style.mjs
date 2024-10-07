import { styleText } from 'node:util'; // from node v20.12.0
import { Command } from 'commander';

// Customise colours and styles for help output.
//
// Commander looks after removing color if NO_COLOR is set
// or output stream (stdout/stderr) does not support color.

const program = new Command();

program.usage(
  `example-color ${styleText('green', '[options]')} ${styleText('yellow', '[command]')}`,
);
program.configureHelp({
  styleTitle: (str) => styleText('bold', str),
  styleDescription: (str) => styleText('magenta', str),
  styleItemDescription: (str) => styleText('italic', str),
  styleOptionTerm: (str) => styleText('green', str),
  styleSubcommandTerm: (str) => styleText('yellow', str),
});

program.description('d '.repeat(100));
program
  .option('-s', 'short flag')
  .option('-f, --flag', 'short and long flag')
  .option('--long <number>', 'l '.repeat(100));

program
  .command('sub1', 'sssss '.repeat(33))
  .command('sub2', 'subcommand 2 description')
  .command('sub3', 'subcommand 3 description');

program.addHelpText(
  'afterAll',
  styleText('italic', '\nThis is additional help text.'),
);

program.parse();

// Try the following:
//    node color-help.mjs --help
//    NO_COLOR=1 node color-help.mjs --help
