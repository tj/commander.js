#!/usr/bin/env node

const { Command, Option } = require('commander');
const program = new Command();

// This example shows using some hooks for life cycle events.

const timeLabel = 'command duration';
program
  .option('--profile', 'show how long command takes')
  .hook('preAction', (thisCommand) => {
    if (thisCommand.opts().profile) {
      console.time(timeLabel);
    }
  })
  .hook('postAction', (thisCommand) => {
    if (thisCommand.opts().profile) {
      console.timeEnd(timeLabel);
    }
  });

program
  .option('--trace', 'display trace statements for commands')
  .hook('preAction', (thisCommand, actionCommand) => {
    if (thisCommand.opts().trace) {
      console.log('>>>>');
      console.log(
        `About to call action handler for subcommand: ${actionCommand.name()}`,
      );
      console.log('arguments: %O', actionCommand.args);
      console.log('options: %o', actionCommand.opts());
      console.log('<<<<');
    }
  });

program
  .option('--env <filename>', 'specify environment file')
  .hook('preSubcommand', (thisCommand, subcommand) => {
    if (thisCommand.opts().env) {
      // One use case for this hook is modifying environment variables before
      // parsing the subcommand, say by reading .env file.
      console.log(`Reading ${thisCommand.opts().env}...`);
      process.env.PORT = 80;
      console.log(`About to call subcommand: ${subcommand.name()}`);
    }
  });

program
  .command('start')
  .argument('[script]', 'script name', 'server.js')
  .option('-d, --delay <seconds>', 'how long to delay before starting')
  .addOption(
    new Option('-p, --port <number>', 'port number').default(8080).env('PORT'),
  )
  .action(async (script, options) => {
    if (options.delay) {
      await new Promise((resolve) =>
        setTimeout(resolve, parseInt(options.delay) * 1000),
      );
    }
    console.log(`Starting ${script} on port ${options.port}`);
  });

// Some of the hooks or actions are async, so call parseAsync rather than parse.
program.parseAsync().then(() => {});

// Try the following:
//    node hook.js start
//    node hook.js --trace start --port 9000 test.js
//    node hook.js --profile start --delay 5
//    node hook.js --env=production.env start
