#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

// Example program using the command configuration option isDefault to specify the default command.

program
  .command('build')
  .description('build web site for deployment')
  .action(() => {
    console.log('build');
  });

program
  .command('deploy')
  .description('deploy web site to production')
  .action(() => {
    console.log('deploy');
  });

program
  .command('serve', { isDefault: true })
  .description('launch web server')
  .option('-p,--port <port_number>', 'web port')
  .action((options) => {
    console.log(`server on port ${options.port}`);
  });

program.parse(process.argv);

// Try the following:
//    node defaultCommand.mjs build
//    node defaultCommand.mjs serve -p 8080
//    node defaultCommand.mjs -p 443
