const { Argument } = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('Argument methods that should return this for chaining', () => {
  test('when call .default() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.default(3);
    assert.strictEqual(result, argument);
  });

  test('when call .argParser() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.argParser(() => {});
    assert.strictEqual(result, argument);
  });

  test('when call .choices() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.choices(['a']);
    assert.strictEqual(result, argument);
  });

  test('when call .argRequired() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.argRequired();
    assert.strictEqual(result, argument);
  });

  test('when call .argOptional() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.argOptional();
    assert.strictEqual(result, argument);
  });
});
