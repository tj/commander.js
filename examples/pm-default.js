#!/usr/bin/env node
var program = require('..');

program
    .option('-t --test <number>', 'Test inherit subcommand option', /^\d+$/, 500)
    .parse(process.argv);

console.log('default');
console.log(program.test);