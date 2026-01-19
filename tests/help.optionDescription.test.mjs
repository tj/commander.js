import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('Help.optionDescription()', () => {
  test('when option has no description then empty string', () => {
    const option = new commander.Option('-a');
    const helper = new commander.Help();
    assert.equal(helper.optionDescription(option), '');
  });

  test('when option has description then return description', () => {
    const description = 'description';
    const option = new commander.Option('-a', description);
    const helper = new commander.Help();
    assert.equal(helper.optionDescription(option), description);
  });

  test('when boolean option has default value true then return description and default value', () => {
    const description = 'description';
    const option = new commander.Option('-a', description).default(true);
    const helper = new commander.Help();
    assert.equal(
      helper.optionDescription(option),
      'description (default: true)',
    );
  });

  test('when boolean option has default value string then return description without default', () => {
    const description = 'description';
    const option = new commander.Option('-a', description).default('foo');
    const helper = new commander.Help();
    assert.equal(helper.optionDescription(option), 'description');
  });

  test('when optional option has preset value then return description and default value', () => {
    const description = 'description';
    const option = new commander.Option('--aa [value]', description).preset(
      'abc',
    );
    const helper = new commander.Help();
    assert.equal(
      helper.optionDescription(option),
      'description (preset: "abc")',
    );
  });

  test('when boolean option has preset value then return description without default', () => {
    const description = 'description';
    const option = new commander.Option('--bb', description).preset('abc');
    const helper = new commander.Help();
    assert.equal(helper.optionDescription(option), 'description');
  });
  test('when option has env then return description and env name', () => {
    const description = 'description';
    const option = new commander.Option('-a', description).env('ENV');
    const helper = new commander.Help();
    assert.equal(helper.optionDescription(option), 'description (env: ENV)');
  });

  test('when option has default value description then return description and custom default description', () => {
    const description = 'description';
    const defaultValueDescription = 'custom';
    const option = new commander.Option('-a <value>', description).default(
      'default value',
      defaultValueDescription,
    );
    const helper = new commander.Help();
    assert.equal(
      helper.optionDescription(option),
      `description (default: ${defaultValueDescription})`,
    );
  });

  test('when option has default value but not description then return custom default', () => {
    const defaultValueDescription = 'custom';
    const option = new commander.Option('-a <value>').default(
      'default value',
      defaultValueDescription,
    );
    const helper = new commander.Help();
    assert.equal(
      helper.optionDescription(option),
      `(default: ${defaultValueDescription})`,
    );
  });

  test('when option has choices then return description and choices', () => {
    const description = 'description';
    const choices = ['one', 'two'];
    const option = new commander.Option('-a <value>', description).choices(
      choices,
    );
    const helper = new commander.Help();
    assert.equal(
      helper.optionDescription(option),
      'description (choices: "one", "two")',
    );
  });
});
