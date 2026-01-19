import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('Help.longestOptionTermLength()', () => {
  test('when no option then returns zero', () => {
    const program = new commander.Command();
    program.helpOption(false);
    const helper = new commander.Help();
    assert.equal(helper.longestOptionTermLength(program, helper), 0);
  });

  test('when just implicit help option returns length of help flags', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    assert.equal(
      helper.longestOptionTermLength(program, helper),
      '-h, --help'.length,
    );
  });

  test('when multiple option then returns longest length', () => {
    const longestOptionFlags = '-l, --longest <value>';
    const program = new commander.Command();
    program
      .option('--before', 'optional description of flags')
      .option(longestOptionFlags)
      .option('--after');
    const helper = new commander.Help();
    assert.equal(
      helper.longestOptionTermLength(program, helper),
      longestOptionFlags.length,
    );
  });
});
