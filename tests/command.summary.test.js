const commander = require('../');
const { test } = require('node:test');
const assert = require('node:assert/strict');

test('Command.summary(): when set summary then get summary', () => {
  const program = new commander.Command();
  const summary = 'abcdef';
  program.summary(summary);
  assert.equal(program.summary(), summary);
});
