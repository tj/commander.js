#!/usr/bin/env node

// This is used as an example in the README for:
//    Custom option processing
//    You may specify a function to do custom processing of option values. ...

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  return parseInt(value, 10);
}

function increaseVerbosity(dummyValue, previous) {
  return previous + 1;
}

function collect(value, previous) {
  return previous.concat([value]);
}

function commaSeparatedList(value, dummyPrevious) {
  return value.split(',');
}

program
  .option('-f, --float <number>', 'float argument', parseFloat)
  .option('-i, --integer <number>', 'integer argument', myParseInt)
  .option('-v, --verbose', 'verbosity that can be increased', increaseVerbosity, 0)
  .option('-c, --collect <value>', 'repeatable value', collect, [])
  .option('-l, --list <items>', 'comma separated list', commaSeparatedList)
;

program.parse(process.argv);
if (program.float !== undefined) console.log(`float: ${program.float}`);
if (program.integer !== undefined) console.log(`integer: ${program.integer}`);
if (program.verbose > 0) console.log(`verbosity: ${program.verbose}`);
if (program.collect.length > 0) console.log(program.collect);
if (program.list !== undefined) console.log(program.list);

// Try the following:
//  custom -f 1e2
//  custom --integer 2
//  custom -v -v -v
//  custom -c a -c b -c c
//  custom --list x,y,z
//  custom --size huge
