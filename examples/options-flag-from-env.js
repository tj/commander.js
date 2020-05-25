#!/usr/bin/env node

// Commander treats toggles flags when they are specified multiple times, this
// includes when the value is specified via environment variable.
//
// When specifying a boolean flag from an environment variable, it is necessary
// to coerce the value since environment variables are strings.
//
// Example output pretending command called toggle (or try directly with `node options-flag-from-env.js`)
//
// $ toggle
// disabled
// $ toggle -e
// enabled
// $ toggle -ee
// disabled
// $ ENABLE=t toggle
// enabled
// $ ENABLE=t toggle -e
// disabled
// $ ENABLE=f toggle --enable
// enabled

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

function envBoolCoercion(val, prior) {
  if (val !== undefined) {
    return [true, 1, 'true', 't', 'yes', 'y', 'on'].indexOf(
      typeof val === 'string' ? val.toLowerCase() : val
    ) >= 0;
  }
  return !prior;
}

program
  .option('-e, --enable, env:ENABLE', 'enables the feature', envBoolCoercion);

program.parse(process.argv);

console.log(program.enable ? 'enabled' : 'disabled');
