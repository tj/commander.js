import { program, Command, Option, Argument, CommanderError, InvalidArgumentError, Help, createCommand, createArgument, createOption } from '../esm.mjs';

// Do some simple checks that expected imports are available at runtime.
// Run using `npm run test-esm`.
// Similar tests to test-imports.test.ts

function check(condition, explanation) {
  if (!condition) {
    console.log(`Failed assertion: ${explanation}`);
    process.exit(2);
  }
}

function checkClass(obj, name) {
  console.log(`Checking ${name}`);
  check(typeof obj === 'object', `new ${name}() produces object`);
  check(obj.constructor.name === name, `object constructor is ${name}`);
}

console.log('Checking program');
check(typeof program === 'object', 'program is object');
check(program.constructor.name === 'Command', 'program is class Command');

checkClass(new Command(), 'Command');
checkClass(new Option('-e, --example'), 'Option');
checkClass(new CommanderError(1, 'code', 'failed'), 'CommanderError');
checkClass(new InvalidArgumentError('failed'), 'InvalidArgumentError');
checkClass(new Help(), 'Help');
checkClass(new Argument('<file>'), 'Argument');

console.log('Checking createCommand');
check(typeof createCommand === 'function', 'createCommand is function');
console.log('Checking createArgument');
check(typeof createArgument === 'function', 'createArgument is function');
console.log('Checking createOption');
check(typeof createOption === 'function', 'createOption is function');

console.log('No problems');
