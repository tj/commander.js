#!/usr/bin/env node

// This example shows a simple use of addHelpText.
// This is used as an example in the README.

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .option('-f, --foo', 'enable some foo');

program.addHelpText('after', `

Example call:
  $ custom-help --help`);

program.parse(process.argv);

// Try the following:
//  node custom-help --help
