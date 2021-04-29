import { program, Command, Option, CommanderError, InvalidArgumentError, InvalidOptionArgumentError, Help, createCommand } from '../';

import * as commander from '../';

// Do some simple checks that expected imports are available at runtime.
// Similar tests to esm-imports-test.js

// eslint-disable-next-line @typescript-eslint/ban-types
function checkClass(obj: object, name: string) {
  expect(typeof obj).toEqual('object');
  expect(obj.constructor.name).toEqual(name);
}

test('legacy default export of global Command', () => {
  checkClass(commander, 'Command');
});

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
