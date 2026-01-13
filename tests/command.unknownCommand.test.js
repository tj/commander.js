const { createTestCommand } = require('./testHelpers');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('parsing unknown command', () => {
  test('when unknown argument in simple program then error', () => {
    const program = createTestCommand();
    assert.throws(() => {
      program.parse('node test.js unknown'.split(' '));
    });
  });

  test('when unknown command but action handler taking arg then no error', () => {
    const program = createTestCommand();
    program.command('sub');
    program.argument('[args...]').action(() => {});
    assert.doesNotThrow(() => {
      program.parse('node test.js unknown'.split(' '));
    });
  });

  test('when unknown command but listener then no error', () => {
    const program = createTestCommand();
    program.command('sub');
    program.on('command:*', () => {});
    assert.doesNotThrow(() => {
      program.parse('node test.js unknown'.split(' '));
    });
  });

  test('when unknown command then error', () => {
    const program = createTestCommand();
    program.command('sub');
    assert.throws(
      () => {
        program.parse('node test.js unknown'.split(' '));
      },
      { code: 'commander.unknownCommand' },
    );
  });

  test('when unknown command and unknown option then error is for unknown command', () => {
    //  The unknown command is more useful since the option is for an unknown command (and might be
    // ok if the command had been correctly spelled, say).
    const program = createTestCommand();
    program.command('sub');
    assert.throws(
      () => {
        program.parse('node test.js sbu --silly'.split(' '));
      },
      { code: 'commander.unknownCommand' },
    );
  });
});
