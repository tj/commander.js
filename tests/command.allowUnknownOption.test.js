const commander = require('../');
const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Not testing output, just testing whether an error is detected.

describe('allowUnknownOption', () => {
  // Optional. Use internal knowledge to suppress output to keep test output clean.
  let writeErrorSpy;

  beforeEach((t) => {
    writeErrorSpy = t.mock.method(process.stderr, 'write', () => {});
  });

  test('when specify unknown program option then error', () => {
    const program = new commander.Command();
    program.exitOverride().option('-p, --pepper', 'add pepper');

    assert.throws(() => {
      program.parse(['node', 'test', '-m']);
    });
  });

  test('when specify unknown program option and allowUnknownOption(false) then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .allowUnknownOption(false)
      .option('-p, --pepper', 'add pepper');

    assert.throws(() => {
      program.parse(['node', 'test', '-m']);
    });
  });

  test('when specify unknown program option and allowUnknownOption() then no error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .allowUnknownOption()
      .argument('[args...]') // unknown option will be passed as an argument
      .option('-p, --pepper', 'add pepper');

    assert.doesNotThrow(() => {
      program.parse(['node', 'test', '-m']);
    });
  });

  test('when specify unknown program option and allowUnknownOption(true) then no error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .allowUnknownOption(true)
      .argument('[args...]') // unknown option will be passed as an argument
      .option('-p, --pepper', 'add pepper');

    assert.doesNotThrow(() => {
      program.parse(['node', 'test', '-m']);
    });
  });

  test('when specify unknown command option then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('sub')
      .option('-p, --pepper', 'add pepper')
      .action(() => {});

    assert.throws(() => {
      program.parse(['node', 'test', 'sub', '-m']);
    });
  });

  test('when specify unknown command option and allowUnknownOption then no error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
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
