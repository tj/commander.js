#!/usr/bin/env node

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

// This example shows using some hooks for life cycle events.

const timeLabel = 'command duration';
program
  .option('-p, --profile', 'show how long command takes')
  .hook('beforeAction', (context) => {
    if (context.hookedCommand.opts().profile) {
      console.time(timeLabel);
    }
  })
  .hook('afterAction', (context) => {
    if (context.hookedCommand.opts().profile) {
      console.timeEnd(timeLabel);
    }
  });

program
  .option('-t, --trace', 'display trace statements for commands')
  .hook('beforeAction', (context) => {
    if (context.hookedCommand.opts().trace) {
      const actionCommand = context.command;
      console.log('>>>>');
      console.log(`About to call action handler for subcommand: ${actionCommand.name()}`);
      console.log('arguments: %O', actionCommand.args);
      console.log('options: %o', actionCommand.opts());
      console.log('<<<<');
    }
  });

program.command('delay')
  .option('--message <value>', 'custom message to display', 'Thanks for waiting')
  .argument('[seconds]', 'how long to delay', '1')
  .action(async(waitSeconds, options) => {
    await new Promise(resolve => setTimeout(resolve, parseInt(waitSeconds) * 1000));
    console.log(options.message);
  });

program.command('hello')
  .option('-e, --example')
  .action(() => console.log('Hello, world'));

// Some of the hooks or actions are async, so call parseAsync rather than parse.
program.parseAsync().then(() => {});

// Try the following:
//  node hook.js hello
//  node hook.js --profile hello
//  node hook.js --trace hello --example
//  node hook.js delay
//  node hook.js --trace delay --message bye 5
//  node hook.js --profile delay
