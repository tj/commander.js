#!/usr/bin/env node

// This is used as an example in the README for:
//    Required option
//    You may specify a required (mandatory) option using `.requiredOption`, which must have a value after parsing.
//
// Example output pretending command called pizza (or try directly with `node options-mandatory.js`)
//
// $ pizza
// error: required option '-c, --cheese <type>' not specified

const commander = require('..'); // For running direct from git clone of commander repo
const program = new commander.Command();

program
  .requiredOption('-c, --cheese <type>', 'pizza must have cheese');

program.parse(process.argv);
