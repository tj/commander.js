#!/usr/bin/env node

const program = require('commander');

program
  .option('-n, --no-sauce', 'Remove sauce')
  .parse(process.argv);

if (program.sauce) console.log('you ordered a pizza with sauce');
else console.log('you ordered a pizza without sauce');
