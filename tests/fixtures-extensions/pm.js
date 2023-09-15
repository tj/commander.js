#!/usr/bin/env node

const { program } = require('../../');

program
  .command('try-ts', 'test file extension lookup')
  .command('try-cjs', 'test file extension lookup')
  .command('try-mjs', 'test file extension lookup')
  .parse(process.argv);
