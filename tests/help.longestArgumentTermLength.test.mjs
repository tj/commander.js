import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('Help.longestArgumentTermLength()', () => {
  test('when no arguments then returns zero', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    assert.equal(helper.longestArgumentTermLength(program, helper), 0);
  });

  test('when has argument description then returns argument length', () => {
    const program = new commander.Command();
    program.argument('<wonder>', 'wonder description');
    const helper = new commander.Help();
    assert.equal(
      helper.longestArgumentTermLength(program, helper),
      'wonder'.length,
    );
  });

  test('when has multiple argument descriptions then returns longest', () => {
    const program = new commander.Command();
    program.argument('<alpha>', 'x');
    program.argument('<longest>', 'x');
    program.argument('<beta>', 'x');
    const helper = new commander.Help();
    assert.equal(
      helper.longestArgumentTermLength(program, helper),
      'longest'.length,
    );
  });
});
