import { Option } from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Option.attributeName() with empty hyphen-separated segments', () => {
  test('when flags contain a doubled hyphen then empty segment is skipped', () => {
    assert.equal(new Option('--foo--bar <value>').attributeName(), 'fooBar');
  });

  test('when flags contain a trailing hyphen then empty segment is skipped', () => {
    assert.equal(new Option('--foo- <value>').attributeName(), 'foo');
  });

  test('when negated flags contain a doubled hyphen then empty segment is skipped', () => {
    assert.equal(new Option('--no-foo--bar').attributeName(), 'fooBar');
  });
});
