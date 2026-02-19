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
} = require('../index.js');
const commander = require('../index.js');
const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

// Do some testing of the default export(s).
// Same tests in imports.test.mjs.

function checkClass(obj, name) {
  assert.equal(typeof obj, 'object');
  assert.equal(obj.constructor.name, name);
}

describe('named imports from .cjs', () => {
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

describe('unnamed imports from .cjs', () => {
  test('program', () => {
    checkClass(commander.program, 'Command');
  });

  test('Command', () => {
    checkClass(new commander.Command('name'), 'Command');
  });

  test('Option', () => {
    checkClass(new commander.Option('-e, --example', 'description'), 'Option');
  });

  test('Argument', () => {
    checkClass(new commander.Argument('<foo>', 'description'), 'Argument');
  });

  test('Help', () => {
    checkClass(new commander.Help(), 'Help');
  });

  test('CommanderError', () => {
    checkClass(
      new commander.CommanderError(1, 'code', 'failed'),
      'CommanderError',
    );
  });

  test('InvalidArgumentError', () => {
    checkClass(
      new commander.InvalidArgumentError('failed'),
      'InvalidArgumentError',
    );
  });

  test('InvalidOptionArgumentError', () => {
    // Deprecated
    checkClass(
      new commander.InvalidOptionArgumentError('failed'),
      'InvalidArgumentError',
    );
  });

  test('createCommand', () => {
    checkClass(commander.createCommand('foo'), 'Command');
  });

  test('createOption', () => {
    checkClass(
      commander.createOption('-e, --example', 'description'),
      'Option',
    );
  });

  test('createArgument', () => {
    checkClass(commander.createArgument('<foo>', 'description'), 'Argument');
  });
});
