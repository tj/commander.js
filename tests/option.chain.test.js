const { Option } = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('Option methods that should return this for chaining', () => {
  test('when call .default() then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.default(3);
    assert.equal(result, option);
  });

  test('when call .argParser() then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.argParser(() => {});
    assert.equal(result, option);
  });

  test('when call .makeOptionMandatory() then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.makeOptionMandatory();
    assert.equal(result, option);
  });

  test('when call .hideHelp() then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.hideHelp();
    assert.equal(result, option);
  });

  test('when call .choices() then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.choices(['a']);
    assert.equal(result, option);
  });

  test('when call .env() then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.env('e');
    assert.equal(result, option);
  });

  test('when call .conflicts() then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.conflicts(['a']);
    assert.equal(result, option);
  });

  test('when call .helpGroup(heading) then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.helpGroup('Options:');
    assert.equal(result, option);
  });
});
