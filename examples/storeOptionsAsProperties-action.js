#!/usr/bin/env node

// To avoid possible name clashes, you can change the default behaviour
// of storing the options values as properties on the command object.
// In addition, you can pass just the options to the action handler
// instead of a commmand object. This allows simpler code, and is more consistent
// with the previous behaviour so less code changes from old code.
//
// Example output:
//
// $ node storeOptionsAsProperties-action.js show
// undefined
// undefined
//
// $ node storeOptionsAsProperties-action.js --name foo show --action jump
// jump
// foo

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .storeOptionsAsProperties(false) // <--- change behaviour
  .passCommandToAction(false); // <--- change behaviour

program
  .name('my-program-name')
  .option('-n,--name <name>');

program
  .command('show')
  .option('-a,--action <action>')
  .action((options) => { // <--- passed options, not Command
    console.log(options.action); // <--- matches old code
  });

program.parse(process.argv);

const programOptions = program.opts(); // <--- use opts to access option values
console.log(programOptions.name);
