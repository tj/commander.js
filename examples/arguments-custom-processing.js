#!/usr/bin/env node

// This is used as an example in the README for:
//    Custom argument processing
//    You may specify a function to do custom processing of argument values.

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

program
  .argument('<first>', 'integer argument', myParseInt)
  .argument('[second]', 'integer argument', myParseInt, 1000)
  .action((first, second) => {
    console.log(`${first} + ${second} = ${first + second}`);
  })
;

program.parse();

// Try the following:
//    node arguments-custom-processing --help
//    node arguments-custom-processing 2
//    node arguments-custom-processing 12 56
