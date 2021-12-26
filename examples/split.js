// const { program } = require('commander'); // (normal include)
const { program } = require('../'); // include commander in git clone of commander repo

// This is used as an example in the README for the Quick Start.

program
  .option('--first')
  .option('-s, --separator <char>');

program.parse();

const options = program.opts();
const limit = options.first ? 1 : undefined;
console.log(program.args[0].split(options.separator, limit));

// Try the following:
//    node split -s / --fits a/b/c
//    node split -s / --first a/b/c
//    node split --separator=, a,b,c
