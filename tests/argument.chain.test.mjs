import { Argument } from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Argument methods that should return this for chaining', () => {
  test('when call .default() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.default(3);
    assert.equal(result, argument);
  });

  test('when call .argParser() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.argParser(() => {});
    assert.equal(result, argument);
  });

  test('when call .choices() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.choices(['a']);
    assert.equal(result, argument);
  });

  test('when call .argRequired() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.argRequired();
    assert.equal(result, argument);
  });

  test('when call .argOptional() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.argOptional();
    assert.equal(result, argument);
  });
});
