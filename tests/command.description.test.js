const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('Command description()', () => {
  test('when set description then get description', () => {
    const program = new commander.Command();
    const description = 'abcdef';
    program.description(description);
    assert.equal(program.description(), description);
  });
});
