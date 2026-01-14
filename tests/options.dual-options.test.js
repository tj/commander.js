const { Option, DualOptions } = require('../lib/option.mjs');
const { Command } = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// This tests an internal helper class which is not currently exposed on the package.

describe('DualOptions internal helper class', () => {
  test('when positive option then stored in positiveOptions', () => {
    const program = new Command();
    program.option('--one');
    const helper = new DualOptions(program.options);
    assert.equal(helper.positiveOptions.size, 1);
    assert.equal(helper.negativeOptions.size, 0);
    assert.equal(helper.dualOptions.size, 0);
  });

  test('when negative option then stored in negativeOptions', () => {
    const program = new Command();
    program.option('--no-one');
    const helper = new DualOptions(program.options);
    assert.equal(helper.positiveOptions.size, 0);
    assert.equal(helper.negativeOptions.size, 1);
    assert.equal(helper.dualOptions.size, 0);
  });

  test('when unrelated positive and negative options then no dual options', () => {
    const program = new Command();
    program.option('--one').option('--no-two');
    const helper = new DualOptions(program.options);
    assert.equal(helper.dualOptions.size, 0);
  });

  test('when related positive and negative options then stored as dual option', () => {
    const program = new Command();
    program.option('--one').option('--no-one');
    const helper = new DualOptions(program.options);
    assert.equal(helper.dualOptions.size, 1);
  });

  test('when related negative and positive options then stored as dual option', () => {
    const program = new Command();
    program.option('--no-one').option('--one');
    const helper = new DualOptions(program.options);
    assert.equal(helper.dualOptions.size, 1);
  });

  describe('valueFromOption with boolean option', () => {
    const positiveOption = new Option('--one');
    const negativeOption = new Option('--no-one');
    const options = [positiveOption, negativeOption];

    test('when negativeOption with false then return true', () => {
      const helper = new DualOptions(options);
      assert.equal(helper.valueFromOption(false, negativeOption), true);
    });

    test('when negativeOption with true then return false', () => {
      const helper = new DualOptions(options);
      assert.equal(helper.valueFromOption(true, negativeOption), false);
    });

    test('when positiveOption with false then return false', () => {
      const helper = new DualOptions(options);
      assert.equal(helper.valueFromOption(false, positiveOption), false);
    });

    test('when positiveOption with true then return true', () => {
      const helper = new DualOptions(options);
      assert.equal(helper.valueFromOption(true, positiveOption), true);
    });
  });

  describe('valueFromOption with option expecting value and negative with preset', () => {
    const positiveOption = new Option('--one <value>');
    const negativeOption = new Option('--no-one').preset('FALSE');
    const options = [positiveOption, negativeOption];

    test('when negativeOption with FALSE then return true', () => {
      const helper = new DualOptions(options);
      assert.equal(helper.valueFromOption('FALSE', negativeOption), true);
    });

    test('when negativeOption with string then return false', () => {
      const helper = new DualOptions(options);
      assert.equal(helper.valueFromOption('foo', negativeOption), false);
    });

    test('when positiveOption with FALSE then return false', () => {
      const helper = new DualOptions(options);
      assert.equal(helper.valueFromOption('FALSE', positiveOption), false);
    });

    test('when positiveOption with true then return true', () => {
      const helper = new DualOptions(options);
      assert.equal(helper.valueFromOption('foo', positiveOption), true);
    });
  });
});
