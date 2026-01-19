import { program } from 'commander';

// This is used as an example in the README for the Quick Start.

program.option('--first').option('-s, --separator <char>').argument('<string>');

program.parse();

const options = program.opts();
const limit = options.first ? 1 : undefined;
console.log(program.args[0].split(options.separator, limit));

// Try the following:
//    node split.mjs -s / --fits a/b/c
//    node split.mjs -s / --first a/b/c
//    node split.mjs --separator=, a,b,c
