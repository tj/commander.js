const { Command, Option } = require('commander');

// The help group can be set explicitly on an Option or Command using `.helpGroup()`,
// or by setting the default group before adding the option or command.

const program = new Command();

const directGroups = program
  .command('direct-groups')
  .description('example with help groups set by using .helpGroup()')
  .addOption(
    new Option('-d, --debug', 'add extra trace information').helpGroup(
      'Development Options:',
    ),
  );
directGroups
  .command('watch')
  .description('run project in watch mode')
  .helpGroup('Development Commands:');

const defaultGroups = program
  .command('default-groups')
  .description(
    'example with help groups set by using optionsGroup/commandsGroup ',
  )
  .optionsGroup('Development Options:')
  .option('-d, --debug', 'add extra trace information', 'Development Options:');
defaultGroups.commandsGroup('Development Commands:');
defaultGroups.command('watch').description('run project in watch mode');

program
  .command('built-in')
  .description(
    'changing the help for built-ins by explicitly customising built-in',
  )
  .optionsGroup('Built-in Options:')
  .version('v2.3.4')
  .helpOption('-h, --help') // get default group by customising help option
  .commandsGroup('Built-in Commands:')
  .helpCommand('help'); // get default group by customising help option

program.parse();

// Try the following:
//    node help-groups.js help direct-groups
//    node help-groups.js help default-groups
//    node help-groups.js help built-in
