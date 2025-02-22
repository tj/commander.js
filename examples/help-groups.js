const { Command, Option } = require('commander');

const program = new Command();

// Default option group (Options:)
program.option('-u, --user', 'username to use, instead of current user');
program.groupOptions('Built-in Options:', ['help']);

const devHelpGroup = 'Development Options:';
program
  .addOption(
    new Option('--profile', 'show how long command takes').helpGroup(
      devHelpGroup,
    ),
  )
  .addOption(
    new Option('-d, --debug', 'add extra trace information').helpGroup(
      devHelpGroup,
    ),
  );

// Default help group (Commands:)
program.command('deploy').description('deploy project');
program.command('restart').description('restart project');
program.groupCommands('Built-in Commands:', ['help']);

const userManagementGroup = 'User Management:';
program
  .command('sign-in')
  .description('sign in user')
  .helpGroup(userManagementGroup);
program
  .command('sign-out')
  .description('sign out')
  .helpGroup(userManagementGroup);

program.parse();
