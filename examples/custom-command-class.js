#!/usr/bin/env node

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo

class MyCommand extends commander.Command {
  createCommand(name) {
    const cmd = new MyCommand(name);
    cmd.option('-d,--debug', 'output options');
    return cmd;
  }
};

const program = new MyCommand();
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
//    node custom-command-class.js help demo
//    node custom-command-class.js demo --debug
//    node custom-command-class.js demo --debug --port 8080
