import * as commander from '../index.js';
import { createTestCommand } from './testHelpers.mjs';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Option.choices()', () => {
  test('when option argument in choices then option set', () => {
    const program = new commander.Command();
    program.addOption(
      new commander.Option('--colour <shade>').choices(['red', 'blue']),
    );
    program.parse(['--colour', 'red'], { from: 'user' });
    assert.equal(program.opts().colour, 'red');
  });

  test('when option argument is not in choices then error', () => {
    // Lightweight check, more detailed testing of behaviour in command.exitOverride.test.js
    const program = createTestCommand();
    program.addOption(
      new commander.Option('--colour <shade>').choices(['red', 'blue']),
    );
    assert.throws(() => {
      program.parse(['--colour', 'orange'], { from: 'user' });
    });
  });

  describe('choices parameter is treated as readonly, per TypeScript declaration', () => {
    test('when choices called then parameter does not change', () => {
      // Unlikely this could break, but check the API we are declaring in TypeScript.
      const original = ['red', 'blue', 'green'];
      const param = original.slice();
      new commander.Option('--colour <shade>').choices(param);
      assert.deepEqual(param, original);
    });

    test('when choices called and argChoices later changed then parameter does not change', () => {
      const original = ['red', 'blue', 'green'];
      const param = original.slice();
      const option = new commander.Option('--colour <shade>').choices(param);
      option.argChoices.push('purple');
      assert.deepEqual(param, original);
    });

    test('when choices called and parameter changed the choices does not change', () => {
      const program = createTestCommand();
      const param = ['red', 'blue'];
      program.addOption(
        new commander.Option('--colour <shade>').choices(param),
      );
      param.push('orange');
      assert.throws(() => {
        program.parse(['--colour', 'orange'], { from: 'user' });
      });
    });
  });
});
