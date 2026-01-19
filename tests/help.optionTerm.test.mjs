import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('Help.optionTerm()', () => {
  test('when -s flags then returns flags', () => {
    const flags = '-s';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    assert.equal(helper.optionTerm(option), flags);
  });

  test('when --short flags then returns flags', () => {
    const flags = '--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    assert.equal(helper.optionTerm(option), flags);
  });

  test('when -s,--short flags then returns flags', () => {
    const flags = '-s,--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    assert.equal(helper.optionTerm(option), flags);
  });

  test('when -s|--short flags then returns flags', () => {
    const flags = '-s|--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    assert.equal(helper.optionTerm(option), flags);
  });
});
