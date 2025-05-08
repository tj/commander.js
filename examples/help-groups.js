const { Command, Option } = require('commander');

// Show the two approaches for adding help groups, and how to customise the built-in help and version.

const program = new Command();
const devOptionsHeading = 'Development Options:';
const managementCommandsHeading = 'Management Commands:';

// The high-level approach is use .optionsGroup() and .commandsGroup() before adding the options/commands.
const docker1 = program
  .command('docker1')
  .description('help groups created using .optionsGroup() and .commandsGroup()')
  .addOption(new Option('-h, --hostname <name>', 'container host name'))
  .addOption(new Option('-p, --port <number>', 'container port number'))
  .optionsGroup(devOptionsHeading)
  .option('-d, --debug', 'add extra trace information')
  .option('-w, --watch', 'run and relaunch service on file changes');

docker1
  .command('run')
  .description('create and run a new container from an image');
docker1.command('exec').description('execute a command in a running container');

docker1.commandsGroup(managementCommandsHeading);
docker1.command('images').description('manage images');
docker1.command('volumes').description('manage volumes');

// The low-level approach is using .helpGroup() on the Option or Command.
const docker2 = program
  .command('docker2')
  .description('help groups created using .helpGroup()')
  .addOption(new Option('-h, --hostname <name>', 'container host name'))
  .addOption(new Option('-p, --port <number>', 'container port number'))
  .addOption(
    new Option('-d, --debug', 'add extra trace information').helpGroup(
      devOptionsHeading,
    ),
  )
  .addOption(
    new Option(
      '-w, --watch',
      'run and relaunch service on file changes',
    ).helpGroup(devOptionsHeading),
  );

docker2
  .command('run')
  .description('create and run a new container from an image');
docker2.command('exec').description('execute a command in a running container');

docker2
  .command('images')
  .description('manage images')
  .helpGroup(managementCommandsHeading);
docker2
  .command('volumes')
  .description('manage volumes')
  .helpGroup(managementCommandsHeading);

// Customise group for built-ins by configuring them with default group set.
program
  .command('built-in')
  .description('help groups for help and version')
  .optionsGroup('Built-in Options:')
  .version('v2.3.4')
  .helpOption('-h, --help') // or .helpOption(true) to use default flags
  .commandsGroup('Built-in Commands:')
  .helpCommand('help [command]'); // or .helpCommand(true) to use default name

program.parse();

// Try the following:
//    node help-groups.js help docker1
//    node help-groups.js help docker2
//    node help-groups.js help built-in
