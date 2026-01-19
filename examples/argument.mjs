#!/usr/bin/env node

// This example shows specifying the command arguments using argument() function.

import { Command } from 'commander';
const program = new Command();

program
  .name('connect')
  .argument('<server>', 'connect to the specified server')
  .argument('[user]', 'user account for connection', 'guest')
  .description('Example program with argument descriptions')
  .action((server, user) => {
    console.log('server:', server);
    console.log('user:', user);
  });

program.parse();

// Try the following:
//    node argument.mjs --help
//    node argument.mjs main.remote.site
//    node argument.mjs main.remote.site admin
