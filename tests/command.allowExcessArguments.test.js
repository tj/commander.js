import { createTestCommand } from './testHelpers.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Not testing output, just testing whether an error is detected.

test('Command.allowExcessArguments()', async (t) => {
  const cases = [true, false];
  for (const hasActionHandler of cases) {
    await t.test(
      `when ${hasActionHandler ? 'has' : 'no'} action handler`,
      async (t) => {
        function configureCommand(cmd) {
          if (hasActionHandler) cmd.action(() => {});
        }

        await t.test(
          'when specify excess program argument then error by default',
          () => {
            const program = createTestCommand();
            configureCommand(program);

            assert.throws(
              () => {
                program.parse(['excess'], { from: 'user' });
              },
              { code: 'commander.excessArguments' },
            );
          },
        );

        await t.test(
          'when specify excess program argument and allowExcessArguments(false) then error',
          () => {
            const program = createTestCommand();
            configureCommand(program);
            program.allowExcessArguments(false);

            assert.throws(
              () => {
                program.parse(['excess'], { from: 'user' });
              },
              { code: 'commander.excessArguments' },
            );
          },
        );

        await t.test(
          'when specify excess program argument and allowExcessArguments() then no error',
          () => {
            const program = createTestCommand();
            configureCommand(program);
            program.allowExcessArguments();

            assert.doesNotThrow(() => {
              program.parse(['excess'], { from: 'user' });
            });
          },
        );

        await t.test(
          'when specify excess program argument and allowExcessArguments(true) then no error',
          () => {
            const program = createTestCommand();
            configureCommand(program);
            program.allowExcessArguments(true);

            assert.doesNotThrow(() => {
              program.parse(['excess'], { from: 'user' });
            });
          },
        );

        await t.test(
          'when specify excess command argument then error (by default)',
          () => {
            const program = createTestCommand();
            const sub = program.command('sub');
            configureCommand(sub);

            assert.throws(
              () => {
                program.parse(['sub', 'excess'], { from: 'user' });
              },
              { code: 'commander.excessArguments' },
            );
          },
        );

        await t.test(
          'when specify excess command argument and allowExcessArguments(false) then error',
          () => {
            const program = createTestCommand();
            const sub = program.command('sub').allowExcessArguments(false);
            configureCommand(sub);

            assert.throws(
              () => {
                program.parse(['sub', 'excess'], { from: 'user' });
              },
              { code: 'commander.excessArguments' },
            );
          },
        );

        await t.test(
          'when specify expected arg and allowExcessArguments(false) then no error',
          () => {
            const program = createTestCommand();
            configureCommand(program);
            program.argument('<file>').allowExcessArguments(false);

            assert.doesNotThrow(() => {
              program.parse(['file'], { from: 'user' });
            });
          },
        );

        await t.test(
          'when specify excess after <arg> and allowExcessArguments(false) then error',
          () => {
            const program = createTestCommand();
            configureCommand(program);
            program.argument('<file>').allowExcessArguments(false);

            assert.throws(
              () => {
                program.parse(['file', 'excess'], { from: 'user' });
              },
              { code: 'commander.excessArguments' },
            );
          },
        );

        await t.test(
          'when specify excess after [arg] and allowExcessArguments(false) then error',
          () => {
            const program = createTestCommand();
            configureCommand(program);
            program.argument('[file]').allowExcessArguments(false);

            assert.throws(
              () => {
                program.parse(['file', 'excess'], { from: 'user' });
              },
              { code: 'commander.excessArguments' },
            );
          },
        );

        await t.test(
          'when specify args for [args...] and allowExcessArguments(false) then no error',
          () => {
            const program = createTestCommand();
            configureCommand(program);
            program.argument('[files...]').allowExcessArguments(false);

            assert.doesNotThrow(() => {
              program.parse(['file1', 'file2', 'file3'], { from: 'user' });
            });
          },
        );
      },
    );
  }
});
