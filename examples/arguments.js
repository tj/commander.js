#!/usr/bin/env node

// This example shows specifying the arguments for the program to pass to the action handler.

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .version('0.1.0')
  .arguments('<username> [password]')
  .description('test command', {
    username: 'user to login',
    password: 'password for user, if required'
  })
  .action((username, password) => {
    console.log('username:', username);
    console.log('password:', password || 'no password given');
  });

program.parse();

// Try the following:
//    node arguments.js --help
//    node arguments.js user
//    node arguments.js user secret
