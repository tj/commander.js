#!/usr/bin/env node

// This example shows most of the help event listeners.

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program.name('awesome');

program
  .on('preGroupHelp', (context) => {
    context.log('A W E S O M E');
    context.log();
  })
  .on('postGroupHelp', (context) => {
    context.log();
    context.log('See web site for further help');
  });

program
  .command('extra')
  .on('preHelp', (context) => {
    context.log('Note: the extra command does not do anything');
    context.log();
  })
  .on('postHelp', (context) => {
    context.log();
    context.log('Examples:');
    context.log('  awesome extra --help');
    context.log('  awesome help extra');
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
