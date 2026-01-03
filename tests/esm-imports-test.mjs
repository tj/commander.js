import {
  program,
  Command,
  Option,
  Argument,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  Help,
  createCommand,
  createArgument,
  createOption,
} from '../esm.mjs';
import { test } from 'node:test';

// Do some simple checks that expected imports are available at runtime.
// Run using `npm run test-esm`.
// Similar tests to test-imports.test.ts

test('ESM imports', () => {
  function check(condition, explanation) {
    if (!condition) {
      throw new Error(`Failed assertion: ${explanation}`);
    }
  }

  function checkClass(obj, name) {
    check(typeof obj === 'object', `new ${name}() produces object`);
    check(obj.constructor.name === name, `object constructor is ${name}`);
  }

  check(typeof program === 'object', 'program is object');
  check(program.constructor.name === 'Command', 'program is class Command');

  checkClass(new Command(), 'Command');
  checkClass(new Option('-e, --example'), 'Option');
  checkClass(new CommanderError(1, 'code', 'failed'), 'CommanderError');
  checkClass(new InvalidArgumentError('failed'), 'InvalidArgumentError');
  checkClass(new InvalidOptionArgumentError('failed'), 'InvalidArgumentError');
  checkClass(new Help(), 'Help');
  checkClass(new Argument('<file>'), 'Argument');

  check(typeof createCommand === 'function', 'createCommand is function');
  check(typeof createArgument === 'function', 'createArgument is function');
  check(typeof createOption === 'function', 'createOption is function');
});
