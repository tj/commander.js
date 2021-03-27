#!/usr/bin/env node

// This example is used as an example in the README for the action handler.

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .argument('<name>')
  .option('-t, --title <honorific>', 'title to use before name')
  .option('-d, --debug', 'display some debugging')
  .action((name, options, command) => {
    if (options.debug) {
      console.error('Called %s with options %o', command.name(), options);
    }
    const title = options.title ? `${options.title} ` : '';
    console.log(`Thank-you ${title}${name}`);
  });

program.parse();

// Try the following:
//   node thank.js John
//   node thank.js Doe --title Mr
//   node thank.js --debug Doe --title Mr
