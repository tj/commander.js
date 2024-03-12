const commander = require('commander');

// By default the subcommand list includes a fairly simple usage. If you have added a custom usage
// to the subcommands you may wish to configure the help to show these instead.
//
// See also ./configure-help.js which shows configuring the subcommand list to have no usage at all
// and just the subcommand name.

const program = new commander.Command().configureHelp({
  subcommandTerm: (cmd) => cmd.name() + ' ' + cmd.usage(),
});

program
  .command('make <FILENAME>')
  .usage('-root ROOTDIR [-abc] <FILENAME>')
  .requiredOption('--root <ROOTDIR>')
  .option('-a')
  .option('-b')
  .option('-c')
  .summary('example command with custom usage')
  .description(
    'this full description is  displayed in the full help and not in the list of subcommands',
  );

program
  .command('serve <SERVICE>')
  .option('--port <PORTNUMBER>')
  .description('example command with default simple usage');

program.parse();

// Try the following:
//    node help-subcommands-usage help
