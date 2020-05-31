#!/usr/bin/env node

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo

// Use a class override of createCommand to customise subcommands,
// in this example by adding --debug option.

class MyCommand extends commander.Command {
  createCommand(name) {
    const cmd = new MyCommand(name);
    cmd.option('-d,--debug', 'output options');
    return cmd;
  }
};

const program = new MyCommand();
program
  .command('serve')
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
//    node custom-command-class.js help serve
//    node custom-command-class.js serve --debug
//    node custom-command-class.js serve --debug --port 8080
