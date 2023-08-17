import * as commander from '../';

const { program, Command, Option, CommanderError, InvalidArgumentError, InvalidOptionArgumentError, Help, createCommand } = commander;

// Do some simple checks that expected imports are available at runtime.
// Similar tests to esm-imports-test.js

// eslint-disable-next-line @typescript-eslint/ban-types
function checkClass(obj: object, name: string): void {
  expect(typeof obj).toEqual('object');
  expect(obj.constructor.name).toEqual(name);
}

describe('commander (check that "esModuleInterop": true is set in TSConfig if this block fails)', () => {
  test.each([
    'program',
    'createCommand',
    'createArgument',
    'createOption',
    'CommanderError',
    'InvalidArgumentError',
    'InvalidOptionArgumentError',
    'Command',
    'Argument',
    'Option',
    'Help'
  ])('has %s', (key) => {
    expect(commander).toHaveProperty(key);
  });
});

describe('class name as expected', () => {
  test('program', () => {
    checkClass(program, 'Command');
  });

  test('createCommand', () => {
    checkClass(createCommand(), 'Command');
  });

  test('Command', () => {
    checkClass(new Command('name'), 'Command');
  });

  test('Option', () => {
    checkClass(new Option('-e, --example', 'description'), 'Option');
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

  test('Help', () => {
    checkClass(new Help(), 'Help');
  });
});
