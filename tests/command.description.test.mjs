import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Command description()', () => {
  test('when set description then get description', () => {
    const program = new commander.Command();
    const description = 'abcdef';
    program.description(description);
    assert.equal(program.description(), description);
  });
});
