#!/usr/bin/env node

const program = require('../../');

program
  .command('sub', 'install one or more packages')
  .parse(process.argv);
