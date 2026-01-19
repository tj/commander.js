import * as commander from '../index.js';
import { createTestCommand } from './testHelpers.mjs';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// option with required value, no default
describe('option with required option-argument, no default', () => {
  test('when option not specified then value is undefined', () => {
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type');
    program.parse(['node', 'test']);
    assert.equal(program.opts().cheese, undefined);
  });

  test('when option specified then value is as specified', () => {
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type');
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    assert.equal(program.opts().cheese, cheeseType);
  });

  test('when option value not specified then error', () => {
    const program = createTestCommand();
    program.option('--cheese <type>', 'cheese type');

    // Act. The throw is due to the above mock, and not default behaviour.
    assert.throws(
      () => {
        program.parse(['node', 'test', '--cheese']);
      },
      {
        code: 'commander.optionMissingArgument',
      },
    );
  });
});

// option with required value, with default
describe('option with required option-argument, with default', () => {
  test('when option not specified then value is default', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type', defaultValue);
    program.parse(['node', 'test']);
    assert.equal(program.opts().cheese, defaultValue);
  });

  test('when option specified then value is as specified', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type', defaultValue);
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    assert.equal(program.opts().cheese, cheeseType);
  });

  test('when option value not specified then error', (t) => {
    const defaultValue = 'default';
    const program = createTestCommand();
    program.option('--cheese <type>', 'cheese type', defaultValue);

    assert.throws(
      () => {
        program.parse(['node', 'test', '--cheese']);
      },
      { code: 'commander.optionMissingArgument' },
    );
  });
});
