import { program, Command, Option, CommanderError, InvalidOptionArgumentError, Help, createCommand } from '../esm.mjs';

// Do some simple checks that expected imports are available.
// Run using `npm run test-esm`.
// Not included in `npm run test-all` as depends on node version supporting esm.

function check(condition, explanation) {
  if (!condition) {
    console.log(`Failed assertion: ${explanation}`);
    process.exit(2);
  }
}

function checkConstructor(classConstructor, name) {
  console.log(`Checking class ${name}`);
  check(typeof classConstructor === 'function', `${name} is function (constructor)`);
  check(classConstructor.name === name, `(constructor) name is ${name}`);
}

check(typeof program === 'object', 'program is object');
check(program.constructor.name === 'Command', 'program is class Command');

checkConstructor(Command, 'Command');
checkConstructor(Option, 'Option');
checkConstructor(CommanderError, 'CommanderError');
checkConstructor(InvalidOptionArgumentError, 'InvalidOptionArgumentError');
checkConstructor(Help, 'Help');

check(typeof createCommand === 'function', 'createCommand is function');

console.log('No problems');
