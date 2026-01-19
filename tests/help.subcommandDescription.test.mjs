import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as commander from '../index.js';

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('Help.subcommandDescription()', () => {
  test('when program has no summary or description then empty string', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    assert.equal(helper.subcommandDescription(program), '');
  });

  test('when program has summary then return summary', () => {
    const summary = 'summary';
    const program = new commander.Command();
    program.summary(summary);
    const helper = new commander.Help();
    assert.equal(helper.subcommandDescription(program), summary);
  });

  test('when program has description then return description', () => {
    const description = 'description';
    const program = new commander.Command();
    program.description(description);
    const helper = new commander.Help();
    assert.equal(helper.subcommandDescription(program), description);
  });

  test('when program has summary and description then return summary', () => {
    const summary = 'summary';
    const program = new commander.Command();
    program.summary(summary);
    program.description('description');
    const helper = new commander.Help();
    assert.equal(helper.subcommandDescription(program), summary);
  });
});
