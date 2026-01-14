const {
  program,
  Command,
  Option,
  Argument,
  Help,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  createCommand,
  createOption,
  createArgument,
} = require('../index.mjs');
const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

// Do some testing of the default export(s).
// Same tests in imports.test.mjs.

function checkClass(obj, name) {
  assert.equal(typeof obj, 'object');
  assert.equal(obj.constructor.name, name);
}

describe('imports from .cjs', () => {
  test('program', () => {
    checkClass(program, 'Command');
  });

  test('Command', () => {
    checkClass(new Command('name'), 'Command');
  });

  test('Option', () => {
    checkClass(new Option('-e, --example', 'description'), 'Option');
  });

  test('Argument', () => {
    checkClass(new Argument('<foo>', 'description'), 'Argument');
  });

  test('Help', () => {
    checkClass(new Help(), 'Help');
  });

  test('CommanderError', () => {
    checkClass(new CommanderError(1, 'code', 'failed'), 'CommanderError');
  });

  test('InvalidArgumentError', () => {
    checkClass(new InvalidArgumentError('failed'), 'InvalidArgumentError');
  });

  test('InvalidOptionArgumentError', () => {
    // Deprecated
    checkClass(
      new InvalidOptionArgumentError('failed'),
      'InvalidArgumentError',
    );
  });

  test('createCommand', () => {
    checkClass(createCommand('foo'), 'Command');
  });

  test('createOption', () => {
    checkClass(createOption('-e, --example', 'description'), 'Option');
  });

  test('createArgument', () => {
    checkClass(createArgument('<foo>', 'description'), 'Argument');
  });
});
