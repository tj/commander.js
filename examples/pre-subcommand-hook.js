#!/usr/bin/env node

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

// This example shows using preSubcommand hook for life cycle events.

program
  .addOption(new commander.Option('--env <env>', 'env file').default('.env'))
  .hook('preSubcommand', (thisCommand, subCommand) => {
    console.log('preSubcommand triggered', { thisCommand: thisCommand.name(), subCommand: subCommand.name() });
    // dotenv.config({ path: envFile, override: true, debug: !production });
    const { env } = thisCommand.opts();
    if (env === '.env.production') {
      process.env.PORT = '80';
    } else {
      process.env.PORT = '8080';
    }
  })
  .hook('preAction', (thisCommand, actionCommand) => {
    console.log('preAction triggered', { thisCommand: thisCommand.name(), actionCommand: actionCommand.name() });
  });

program.command('start')
  .addOption(new commander.Option('-p --port <port>', 'set port to listen').default(3000, '3000').env('PORT').argParser(parsePort))
  .action(async(options) => {
    console.log(`start listen port ${options.port}!`);
  });

program.command('nested')
  .description('nested sub-command test')
  // .hook('preSubcommand', (thisCommand, subCommand) => {
  //   console.log('preSubcommand triggered', { thisCommand: thisCommand.name(), subCommand: subCommand.name() });
  // })
  .command('first')
  // .hook('preSubcommand', (thisCommand, subCommand) => {
  //   console.log('preSubcommand triggered', { thisCommand: thisCommand.name(), subCommand: subCommand.name() });
  // })
  .action(() => console.log('first'))
  .command('second')
  .action(() => console.log('second'));

// Some of the hooks or actions are async, so call parseAsync rather than parse.
program.parseAsync()
  .catch(err => {
    console.error(err);
  });

function parsePort(value) {
  const port = Number.parseInt(value);
  if (port >= 0 && port <= 65535) {
    return port;
  }
  throw new commander.InvalidArgumentError('Not a valid port.');
}

// Try the following:
//    node pre-subcommand-hook.js
//    node pre-subcommand-hook.js start                         # start listen port 8080!
//    node pre-subcommand-hook.js start --port 80               # start listen port 80!
//    node pre-subcommand-hook.js --env .env.production start   # start listen port 80!
//    node pre-subcommand-hook.js --env .env.development start  # start listen port 8080!

// Hooks are added to the current command, fires before the subcommands of the current command are parsed.
// And the preSubcommand hook has different parameters from preAction
//    node pre-subcommand-hook.js nested first second
