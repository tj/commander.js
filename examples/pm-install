#!/usr/bin/env node

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .option('-f, --force', 'force installation');

program.parse(process.argv);

const pkgs = program.args;

if (!pkgs.length) {
  console.error('packages required');
  process.exit(1);
}

console.log();
if (program.opts().force) console.log('  force: install');
pkgs.forEach(function(pkg) {
  console.log('  install : %s', pkg);
});
console.log();
