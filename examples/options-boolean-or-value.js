#!/usr/bin/env node

// This is used as an example in the README for:
//    Other option types, flag|value
//    You can specify an option which functions as a flag but may also take a value (declared using square brackets).

const commander = require('commander');
const program = new commander.Command();

program.option('-c, --cheese [type]', 'Add cheese with optional type');

program.parse(process.argv);

const options = program.opts();
if (options.cheese === undefined) console.log('no cheese');
else if (options.cheese === true) console.log('add cheese');
else console.log(`add cheese type ${options.cheese}`);

// Try the following:
//    node options-boolean-or-value
//    node options-boolean-or-value --cheese
//    node options-boolean-or-value --cheese mozzarella
