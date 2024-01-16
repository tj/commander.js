#!/usr/bin/env node

// This example is used as an example of rewrite the standart error log method.

const { Command } = require('../');
const program = new Command();

program.customErrorHandler((data) => {
  process.stderr.write(data.replace('error', 'Error (changed)'));
});

program
  .command('set-name')
  .argument('<name>')
  .action(function(e) {
    console.log('Saved name:', e);
  });

program.parse();

// Try the following:
//    node custom-error-handler.js set-name
