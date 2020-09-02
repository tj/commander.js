#!/usr/bin/env node

// This example shows using addHelpText.

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program.name('awesome');

program
  .addHelpText('beforeAll', 'A W E S O M E\n')
  .addHelpText('afterAll', (context) => {
    if (context.error) {
      return '\nHelp being displayed for an error';
    }
    return '\nSee web site for further help';
  });

program
  .command('extra')
  .addHelpText('before', 'Note: the extra command does not do anything')
  .addHelpText('after', `
Examples:
  awesome extra --help
  awesome help extra`);

program.parse();

// Try the following:
//  node custom-help-text.js --help
//  node custom-help-text.js extra --help
//  node custom-help-text.js
