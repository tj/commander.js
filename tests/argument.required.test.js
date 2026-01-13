const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Low-level tests of setting Argument.required.
// Higher level tests of optional/required arguments elsewhere.

describe('Argument required/optional', () => {
  test('when name with surrounding <> then argument required', () => {
    const argument = new commander.Argument('<name>');
    assert.equal(argument.required, true);
  });

  test('when name with surrounding [] then argument optional', () => {
    const argument = new commander.Argument('[name]');
    assert.equal(argument.required, false);
  });

  test('when name without surrounding brackets then argument required', () => {
    // default behaviour, allowed from Commander 8
    const argument = new commander.Argument('name');
    assert.equal(argument.required, true);
  });

  test('when call .argRequired() then argument required', () => {
    const argument = new commander.Argument('name');
    argument.required = false;
    argument.argRequired();
    assert.equal(argument.required, true);
  });

  test('when call .argOptional() then argument optional', () => {
    const argument = new commander.Argument('name');
    argument.required = true;
    argument.argOptional();
    assert.equal(argument.required, false);
  });
});
