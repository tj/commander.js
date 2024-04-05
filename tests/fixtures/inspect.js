#!/usr/bin/env node

const { program } = require('../../');

process.env.FORCE_COLOR = 0; // work-around bug in Jest: https://github.com/jestjs/jest/issues/14391

program.command('sub', 'install one or more packages').parse(process.argv);
