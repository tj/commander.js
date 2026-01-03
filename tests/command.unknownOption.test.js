const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Checking for detection of unknown options, including regression tests for some past issues.

describe('unknownOption', () => {
  function makeProgram() {
    const program = new commander.Command();
    program.exitOverride();
    program.configureOutput({ writeErr: () => {} });
    return program;
  }

  test('when specify unknown option with subcommand and action handler then error', () => {
    const program = makeProgram();
    program.command('info').action(() => {});

    assert.throws(
      () => {
        program.parse(['node', 'test', 'info', '--NONSENSE']);
      },
      { code: 'commander.unknownOption' },
    );
  });

  test('when specify unknown option with subcommand argument and action handler then error', () => {
    const program = makeProgram();
    program.command('info <file>').action(() => {});

    assert.throws(
      () => {
        program.parse(['node', 'test', 'info', 'a', '--NONSENSE']);
      },
      { code: 'commander.unknownOption' },
    );
  });

  test('when specify unknown option with program and action handler then error', () => {
    const program = makeProgram();
    program.argument('[file]').action(() => {});

    assert.throws(
      () => {
        program.parse(['node', 'test', '--NONSENSE']);
      },
      { code: 'commander.unknownOption' },
    );
  });

  test('when specify unknown option with program argument and action handler then error', () => {
    // Regression test from #965
    const program = makeProgram();
    program.argument('[file]').action(() => {});

    assert.throws(
      () => {
        program.parse(['node', 'test', 'info', 'a', '--NONSENSE']);
      },
      { code: 'commander.unknownOption' },
    );
  });

  test('when specify unknown option with simple program then error', () => {
    const program = makeProgram();
    assert.throws(
      () => {
        program.parse(['node', 'test', '--NONSENSE']);
      },
      { code: 'commander.unknownOption' },
    );
  });

  test('when specify unknown global option before subcommand then error', () => {
    const program = makeProgram();
    program.command('sub');

    assert.throws(
      () => {
        program.parse(['--NONSENSE', 'sub'], { from: 'user' });
      },
      { code: 'commander.unknownOption' },
    );
  });
});
