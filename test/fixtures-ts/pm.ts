#!/usr/bin/env node

var program = require('../../');

program
    .version('0.0.1')
    .command('install [name]', 'install one or more packages')
    .parse(process.argv);
