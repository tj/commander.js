#!/usr/bin/env node

// This example shows most of the help event listeners.

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .on('preGroupHelp', (context) => {
    context.log('Custom preGroupHelp: global banner');
  })
  .on('postGroupHelp', (context) => {
    context.log('Custom postGroupHelp: global epilog');
  });

program
  .command('extra')
  .on('preHelp', (context) => {
    context.log('Custom preHelp: header');
  })
  .on('postHelp', (context) => {
    context.log('Custom postHelp: trailer');
  });

program
  .command('replacement')
  .on('help', (context) => {
    context.log(`Completely custom help for ${context.command.name()}`);
  });

program.parse();

// Try the following:
//  node custom-help-listeners.js --help
//  node custom-help-listeners.js extra --help
//  node custom-help-listeners.js replacement --help
