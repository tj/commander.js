#!/usr/bin/env node

// This is used as an example in the README for:
//    Required option
//    You may specify a required (mandatory) option using `.requiredOption`.
//    The option must be specified on the command line, or by having a default value.
//
// Example output pretending command called pizza (or try directly with `node options-required.js`)
//
// $ pizza
// error: required option '-c, --cheese <type>' not specified

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .requiredOption('-c, --cheese <type>', 'pizza must have cheese');

program.parse();
