#!/usr/bin/env node
const { Command, Option } = require('commander');
const program = new Command();

// You can use .conflicts() with a single string, which is the camel-case name of the conflicting option.
program
  .command('pay')
  .addOption(new Option('--cash').conflicts('creditCard'))
  .addOption(new Option('--credit-card'))
  .action((options) => {
    if (options.cash) {
      console.log('Paying by cash');
    } else if (options.creditCard) {
      console.log('Paying by credit card');
    } else {
      console.log('Payment method unknown');
    }
  });

// The default value for an option does not cause a conflict.
// A value specified using an environment variable is checked for conflicts.
program
  .command('source')
  .addOption(
    new Option('-p, --port <number>', 'port number for server')
      .default(80)
      .env('PORT'),
  )
  .addOption(
    new Option(
      '--interactive',
      'prompt for user input instead of listening to a port',
    ).conflicts('port'),
  )
  .action((options) => {
    if (options.interactive) {
      console.log('What do you want to do today?');
    } else {
      console.log(`Running server on port: ${options.port}`);
    }
  });

// You can use .conflicts() with an array of option names.
// A negated option is not separate from the positive option for conflicts (they have same option name).
program
  .command('paint')
  .addOption(
    new Option('--summer', 'use a mixture of summer colors').conflicts([
      'autumn',
      'colour',
    ]),
  )
  .addOption(
    new Option('--autumn', 'use a mixture of autumn colors').conflicts([
      'summer',
      'colour',
    ]),
  )
  .addOption(new Option('--colour <shade>', 'use a single solid colour'))
  .addOption(new Option('--no-colour', 'leave surface natural'))
  .action((options) => {
    let colour = 'not specified';
    if (options.colour === false) {
      colour = 'natural';
    } else if (options.colour) {
      colour = options.colour;
    } else if (options.summer) {
      colour = 'summer';
    } else if (options.autumn) {
      colour = 'autumn';
    }
    console.log(`Painting colour is ${colour}`);
  });

program.parse();

// Try the following:
//    node options-conflicts.js pay --cash --credit-card
//
//    node options-conflicts.js source
//    node options-conflicts.js source --interactive
//    node options-conflicts.js source --port 8080 --interactive
//    PORT=8080 node options-conflicts.js source --interactive
//
//    node options-conflicts.js paint --colour=red --summer
//    node options-conflicts.js paint --no-colour --autumn
