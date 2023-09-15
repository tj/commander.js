import {
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
  createArgument
} from '../';

import * as commander from '../'; // This does interesting things when esModuleInterop is true!

// Do some simple checks that expected imports are available at runtime.
// Similar tests to esm-imports-test.js

// eslint-disable-next-line @typescript-eslint/ban-types
function checkClass(obj: object, name: string): void {
  expect(typeof obj).toEqual('object');
  expect(obj.constructor.name).toEqual(name);
}

describe('named imports', () => {
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

  test('InvalidOptionArgumentError', () => { // Deprecated
    checkClass(new InvalidOptionArgumentError('failed'), 'InvalidArgumentError');
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

describe('import * as commander', () => {
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
    checkClass(new commander.CommanderError(1, 'code', 'failed'), 'CommanderError');
  });

  test('InvalidArgumentError', () => {
    checkClass(new commander.InvalidArgumentError('failed'), 'InvalidArgumentError');
  });

  test('InvalidOptionArgumentError', () => { // Deprecated
    checkClass(new commander.InvalidOptionArgumentError('failed'), 'InvalidArgumentError');
  });

  // Factory functions are not found if esModuleInterop is true, so comment out tests for now.
  // Can uncomment these again when we drop the default export of global program and add the factory functions explicitly.

  // test('createCommand', () => {
  //   checkClass(commander.createCommand('foo'), 'Command');
  // });

  // test('createOption', () => {
  //   checkClass(commander.createOption('-e, --example', 'description'), 'Option');
  // });

  // test('createArgument', () => {
  //   checkClass(commander.createArgument('<foo>', 'description'), 'Argument');
  // });
});
