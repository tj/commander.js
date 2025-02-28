const { Command, Option } = require('commander');

// Show the two approaches for adding help groups, and how to customise the built-in help and version.

const program = new Command();
const devOptionsTitle = 'Development Options:';
const managementCommandsTitle = 'Management Commands:';

// The high-level approach is use .optionsGroup() and .commandsGroup() before adding the options/commands.
const docker1 = program
  .command('docker1')
  .description('help groups created using .optionsGroup() and .commandsGroup()')
  .addOption(new Option('-h, --hostname <name>', 'container host name'))
  .addOption(new Option('-p, --port <number>', 'container port number'))
  .optionsGroup(devOptionsTitle)
  .option('-d, --debug', 'add extra trace information')
  .option('-w, --watch', 'run and relaunch service on file changes');

docker1
  .command('run')
  .description('create and run a new container from an image');
docker1.command('exec').description('execute a command in a running container');

docker1.commandsGroup(managementCommandsTitle);
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
      devOptionsTitle,
    ),
  )
  .addOption(
    new Option(
      '-w, --watch',
      'run and relaunch service on file changes',
    ).helpGroup(devOptionsTitle),
  );

docker2
  .command('run')
  .description('create and run a new container from an image');
docker2.command('exec').description('execute a command in a running container');

docker2
  .command('images')
  .description('manage images')
  .helpGroup(managementCommandsTitle);
docker2
  .command('volumes')
  .description('manage volumes')
  .helpGroup(managementCommandsTitle);

// Customise group for built-ins by explicitly adding them with default group set.
program
  .command('built-in')
  .description('help groups for help and version')
  .optionsGroup('Built-in Options:')
  .version('v2.3.4')
  // .helpOption('-h, --help')
  .helpOption(true)
  .commandsGroup('Built-in Commands:')
  // .helpCommand('help');
  .helpCommand(true);

program.parse();

// Try the following:
//    node help-groups.js help docker1
//    node help-groups.js help docker2
//    node help-groups.js help built-in
