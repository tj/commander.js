const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Test the `.opts()` way of accessing option values.
// Basic coverage of the main option types (leaving out negatable flags and options with optional values).

test('when .version used with storeOptionsAsProperties() then version in opts', () => {
  const program = new commander.Command();
  const version = '0.0.1';
  program.storeOptionsAsProperties().version(version);
  program.parse(['node', 'test']);
  assert.deepEqual(program.opts(), { version });
});

test('when .version used with storeOptionsAsProperties(false) then version not in opts', () => {
  // New behaviour, stop storing version as an option value.
  const program = new commander.Command();
  const version = '0.0.1';
  program.storeOptionsAsProperties(false).version(version);
  program.parse(['node', 'test']);
  assert.deepEqual(program.opts(), {});
});

describe('storeOptionsAsProperties', () => {
  const storeOptionsAsPropertiesList = [true, false];
  for (const storeOptionsAsProperties of storeOptionsAsPropertiesList) {
    test(`when storeOptionsAsProperties is ${storeOptionsAsProperties} and boolean flag not specified then not in opts`, () => {
      const program = new commander.Command();
      program.storeOptionsAsProperties(storeOptionsAsProperties);
      program.option('--pepper', 'add pepper');
      program.parse(['node', 'test']);
      const expected = storeOptionsAsProperties ? { pepper: undefined } : {};
      assert.deepEqual(program.opts(), expected);
    });

    test(`when storeOptionsAsProperties is ${storeOptionsAsProperties} and boolean flag specified then value true`, () => {
      const program = new commander.Command();
      program.storeOptionsAsProperties(storeOptionsAsProperties);
      program.option('--pepper', 'add pepper');
      program.parse(['node', 'test', '--pepper']);
      assert.deepEqual(program.opts(), { pepper: true });
    });

    test(`when storeOptionsAsProperties is ${storeOptionsAsProperties} and option with required value not specified then not in opts`, () => {
      const program = new commander.Command();
      program.storeOptionsAsProperties(storeOptionsAsProperties);
      program.option('--pepper <flavour>', 'add pepper');
      program.parse(['node', 'test']);
      const expected = storeOptionsAsProperties ? { pepper: undefined } : {};
      assert.deepEqual(program.opts(), expected);
    });

    test(`when storeOptionsAsProperties is ${storeOptionsAsProperties} and option with required value specified then value as specified`, () => {
      const pepperValue = 'red';
      const program = new commander.Command();
      program.storeOptionsAsProperties(storeOptionsAsProperties);
      program.option('--pepper <flavour>', 'add pepper');
      program.parse(['node', 'test', '--pepper', pepperValue]);
      assert.deepEqual(program.opts(), { pepper: pepperValue });
    });

    test(`when storeOptionsAsProperties is ${storeOptionsAsProperties} and option with default value not specified then default value in opts`, () => {
      const pepperDefault = 'red';
      const program = new commander.Command();
      program.storeOptionsAsProperties(storeOptionsAsProperties);
      program.option('--pepper <flavour>', 'add pepper', pepperDefault);
      program.parse(['node', 'test']);
      assert.deepEqual(program.opts(), { pepper: pepperDefault });
    });
  }
});
