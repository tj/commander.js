import * as commander from '../index.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('Command.summary(): when set summary then get summary', () => {
  const program = new commander.Command();
  const summary = 'abcdef';
  program.summary(summary);
  assert.equal(program.summary(), summary);
});
