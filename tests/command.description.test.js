const commander = require('../');
const { test } = require('node:test');
const assert = require('node:assert/strict');

test('when set description then get description', () => {
  const program = new commander.Command();
  const description = 'abcdef';
  program.description(description);
  assert.equal(program.description(), description);
});
