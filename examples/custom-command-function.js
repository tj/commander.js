#!/usr/bin/env node

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo

const program = commander.createCommand();

// Customise subcommand creation
program.createCommand = (name) => {
  const cmd = commander.createCommand(name);
  cmd.option('-d,--debug', 'output options');
  return cmd;
};

program
  .command('demo')
  .option('--port <port-number>', 'specify port number', 80)
  .action((cmd) => {
    if (cmd.debug) {
      console.log('Options:');
      console.log(cmd.opts());
      console.log();
    }

    console.log(`Start serve on port ${cmd.port}`);
  });

program.parse();

// Try the following:
//    node custom-command-function.js help demo
//    node custom-command-function.js demo --debug
//    node custom-command-function.js demo --debug --port 8080
