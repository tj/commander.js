import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test for backwards compatible behaviour of deprecated features that don't fit in elsewhere.
// We keep deprecated features working (when not too difficult) to avoid breaking existing code
// and reduce barriers to updating to latest version of Commander.

describe('deprecated support for option custom processing using regular expression', () => {
  test('when option not given then value is default', () => {
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type', /mild|tasty/, 'mild');
    program.parse([], { from: 'user' });
    assert.equal(program.opts().cheese, 'mild');
  });

  test('when argument matches regexp then value is as specified', () => {
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type', /mild|tasty/, 'mild');
    program.parse(['--cheese', 'tasty'], { from: 'user' });
    assert.equal(program.opts().cheese, 'tasty');
  });

  test('when argument does not match regexp then value is default', () => {
    const program = new commander.Command();
    program.option('--cheese <type>', 'cheese type', /mild|tasty/, 'mild');
    program.parse(['--cheese', 'other'], { from: 'user' });
    assert.equal(program.opts().cheese, 'mild');
  });
});
