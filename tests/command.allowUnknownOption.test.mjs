import { createTestCommand } from './testHelpers.mjs';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Not testing output, just testing whether an error is detected.

describe('Command.allowUnknownOption()', () => {
  test('when specify unknown program option then error', () => {
    const program = createTestCommand();
    program.option('-p, --pepper', 'add pepper');

    assert.throws(() => {
      program.parse(['node', 'test', '-m']);
    });
  });

  test('when specify unknown program option and allowUnknownOption(false) then error', () => {
    const program = createTestCommand();
    program.allowUnknownOption(false).option('-p, --pepper', 'add pepper');

    assert.throws(() => {
      program.parse(['node', 'test', '-m']);
    });
  });

  test('when specify unknown program option and allowUnknownOption() then no error', () => {
    const program = createTestCommand();
    program

      .allowUnknownOption()
      .argument('[args...]') // unknown option will be passed as an argument
      .option('-p, --pepper', 'add pepper');

    assert.doesNotThrow(() => {
      program.parse(['node', 'test', '-m']);
    });
  });

  test('when specify unknown program option and allowUnknownOption(true) then no error', () => {
    const program = createTestCommand();
    program

      .allowUnknownOption(true)
      .argument('[args...]') // unknown option will be passed as an argument
      .option('-p, --pepper', 'add pepper');

    assert.doesNotThrow(() => {
      program.parse(['node', 'test', '-m']);
    });
  });

  test('when specify unknown command option then error', () => {
    const program = createTestCommand();
    program

      .command('sub')
      .option('-p, --pepper', 'add pepper')
      .action(() => {});

    assert.throws(() => {
      program.parse(['node', 'test', 'sub', '-m']);
    });
  });

  test('when specify unknown command option and allowUnknownOption then no error', () => {
    const program = createTestCommand();
    program

      .command('sub')
      .argument('[args...]') // unknown option will be passed as an argument
      .allowUnknownOption()
      .option('-p, --pepper', 'add pepper')
      .action(() => {});

    assert.doesNotThrow(() => {
      program.parse(['node', 'test', 'sub', '-m']);
    });
  });
});
