// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo

// This is a contrived example to show some different ways to display the list of subcommands.
// By default the subcommand list includes a simple usage. If you have defined a custom usage,
// you may prefer to show these. Or you may prefer to keep the list simple and leave the
// usage details for the subcommand help.
//
// Normally you would customise the help on the program before adding the subcommands and
// it will apply to all the subcommands too. For this example, we use `.configureHelp()` on
// the subcommand so we can see different styles.

function addSubcommands(cmd) {
  cmd.command('make <FILENAME>')
    .usage('-root ROOTDIR [-abc] <FILENAME>')
    .requiredOption('--root <ROOTDIR>')
    .option('-a')
    .option('-b')
    .option('-c')
    .summary('example command with custom usage')
    .description('this is displayed in the full help and not in the list of subcommands of the parent');
  cmd.command('serve')
    .option('--port <PORTNUMBER>')
    .description('example command with just a description');
}

const program = new commander.Command();

const plain = program.command('plain')
  .description('has default help');
addSubcommands(plain);

const custom = program.command('custom')
  .description('has custom help which shows custom usage')
  .configureHelp({ subcommandTerm: (cmd) => cmd.name() + ' ' + cmd.usage() });
addSubcommands(custom);

const nameOnly = program.command('name')
  .description('has custom help which shows just the subcommand name and no usage')
  .configureHelp({ subcommandTerm: (cmd) => cmd.name() });
addSubcommands(nameOnly);

program.parse();

// Try the following:
//    node help-subcommands help plain
//    node help-subcommands help custom
//    node help-subcommands help name
