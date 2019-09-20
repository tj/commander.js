#!/usr/bin/env node

var program = require('../../');

program
  .command('sub', 'install one or more packages')
  .parse(process.argv);
