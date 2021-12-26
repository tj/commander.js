// const { program } = require('commander'); // (normal include)
const { program } = require('../'); // include commander in git clone of commander repo

program
  .option('--first')
  .option('-s, --separator <char>');

program.parse();

const options = program.opts();
const separator = options.separator || ',';
const limit = options.first ? 1 : undefined;
console.log(program.args[0].split(separator, limit));

// Try the following:
//    node split -s / --fits a/b/c
//    node split -s / --first a/b/c
//    node split --separator=, a,b,c
