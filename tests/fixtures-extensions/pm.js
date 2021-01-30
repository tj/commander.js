#!/usr/bin/env node

var program = require('../../');

program
  .version('0.0.1')
  .command('try-ts', 'test file extension lookup')
  .command('try-cjs', 'test file extension lookup')
  .command('try-mjs', 'test file extension lookup')
  .parse(process.argv);
