const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Not testing output, just testing whether an error is detected.

describe('allowExcessArguments', () => {
  const cases = [true, false];
  cases.forEach((hasActionHandler) => {
    describe(`when ${hasActionHandler ? 'has' : 'no'} action handler`, () => {
      function configureCommand(cmd) {
        cmd.exitOverride().configureOutput({
          writeErr: () => {}, // suppress error output
        });
        if (hasActionHandler) cmd.action(() => {});
      }

      test('when specify excess program argument then error by default', () => {
        const program = new commander.Command();
        configureCommand(program);

        assert.throws(() => {
          program.parse(['excess'], { from: 'user' });
        });
      });

      test('when specify excess program argument and allowExcessArguments(false) then error', () => {
        const program = new commander.Command();
        configureCommand(program);
        program.allowExcessArguments(false);

        assert.throws(() => {
          program.parse(['excess'], { from: 'user' });
        });
      });

      test('when specify excess program argument and allowExcessArguments() then no error', () => {
        const program = new commander.Command();
        configureCommand(program);
        program.allowExcessArguments();

        assert.doesNotThrow(() => {
          program.parse(['excess'], { from: 'user' });
        });
      });

      test('when specify excess program argument and allowExcessArguments(true) then no error', () => {
        const program = new commander.Command();
        configureCommand(program);
        program.allowExcessArguments(true);

        assert.doesNotThrow(() => {
          program.parse(['excess'], { from: 'user' });
        });
      });

      test('when specify excess command argument then error (by default)', () => {
        const program = new commander.Command();
        const sub = program.command('sub');
        configureCommand(sub);

        assert.throws(() => {
          program.parse(['sub', 'excess'], { from: 'user' });
        });
      });

      test('when specify excess command argument and allowExcessArguments(false) then error', () => {
        const program = new commander.Command();
        const sub = program.command('sub').allowExcessArguments(false);
        configureCommand(sub);

        assert.throws(() => {
          program.parse(['sub', 'excess'], { from: 'user' });
        });
      });

      test('when specify expected arg and allowExcessArguments(false) then no error', () => {
        const program = new commander.Command();
        configureCommand(program);
        program.argument('<file>').allowExcessArguments(false);

        assert.doesNotThrow(() => {
          program.parse(['file'], { from: 'user' });
        });
      });

      test('when specify excess after <arg> and allowExcessArguments(false) then error', () => {
        const program = new commander.Command();
        configureCommand(program);
        program.argument('<file>').allowExcessArguments(false);

        assert.throws(() => {
          program.parse(['file', 'excess'], { from: 'user' });
        });
      });

      test('when specify excess after [arg] and allowExcessArguments(false) then error', () => {
        const program = new commander.Command();
        configureCommand(program);
        program.argument('[file]').allowExcessArguments(false);

        assert.throws(() => {
          program.parse(['file', 'excess'], { from: 'user' });
        });
      });

      test('when specify args for [args...] and allowExcessArguments(false) then no error', () => {
        const program = new commander.Command();
        configureCommand(program);
        program.argument('[files...]').allowExcessArguments(false);

        assert.doesNotThrow(() => {
          program.parse(['file1', 'file2', 'file3'], { from: 'user' });
        });
      });
    });
  });
});
