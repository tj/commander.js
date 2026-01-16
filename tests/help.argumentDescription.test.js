import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// These are tests of the Help class, not of the Command help.

describe('Help.argumentDescription()', () => {
  test('when argument has no description then empty string', () => {
    const argument = new commander.Argument('[n]');
    const helper = new commander.Help();
    assert.equal(helper.argumentDescription(argument), '');
  });

  test('when argument has description then return description', () => {
    const description = 'description';
    const argument = new commander.Argument('[n]', description);
    const helper = new commander.Help();
    assert.equal(helper.argumentDescription(argument), description);
  });

  test('when argument has default value then return description and default value', () => {
    const argument = new commander.Argument('[n]', 'description').default(
      'default',
    );
    const helper = new commander.Help();
    assert.equal(
      helper.argumentDescription(argument),
      'description (default: "default")',
    );
  });

  test('when argument has default value description then return description and custom default description', () => {
    const argument = new commander.Argument('[n]', 'description').default(
      'default value',
      'custom',
    );
    const helper = new commander.Help();
    assert.equal(
      helper.argumentDescription(argument),
      'description (default: custom)',
    );
  });

  test('when an argument has default value and no description then still return default value', () => {
    const argument = new commander.Argument('[n]').default('default');
    const helper = new commander.Help();
    assert.equal(helper.argumentDescription(argument), '(default: "default")');
  });
});
