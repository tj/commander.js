#!/usr/bin/env node

// This example shows specifying the arguments using addArgument() and argument() function.

// const { Command } = require('commander'); // (normal include)
const { Command, Argument } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .version('0.1.0')
  .addArgument(new Argument('<username>', 'user to login'))
  .argument('[password]', 'password')
  .description('test command')
  .action((username, password) => {
    console.log('username:', username);
    console.log('environment:', password || 'no password given');
  });

program.parse();

// Try the following:
//    node arguments.js --help
//    node arguments.js user
//    node arguments.js user secret
