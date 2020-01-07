#!/usr/bin/env node

// To avoid possible name clashes, you can change the default behaviour
// of storing the options values as properties on the command object.
// You access the option values using the .opts() function.
//
// Example output:
//
// $ node storeOptionsAsProperties-opts.js show
// undefined
// undefined
//
// $ node storeOptionsAsProperties-opts.js --name foo show --action jump
// jump
// foo

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .storeOptionsAsProperties(false); // <--- change behaviour

program
  .name('my-program-name')
  .option('-n,--name <name>');

program
  .command('show')
  .option('-a,--action <action>')
  .action((cmd) => {
    const options = cmd.opts(); // <--- use opts to access option values
    console.log(options.action);
  });

program.parse(process.argv);

const programOptions = program.opts(); // <--- use opts to access option values
console.log(programOptions.name);
