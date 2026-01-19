import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Command.getOptionValue() and .setOptionValue()', () => {
  describe('storeOptionsAsProperties', () => {
    const storeOptionsAsPropertiesList = [true, false];
    for (const storeOptionsAsProperties of storeOptionsAsPropertiesList) {
      test(`when storeOptionsAsProperties is ${storeOptionsAsProperties} and option specified on CLI then value returned by getOptionValue`, () => {
        const program = new commander.Command();
        program
          .storeOptionsAsProperties(storeOptionsAsProperties)
          .option('--cheese [type]', 'cheese type');
        const cheeseType = 'blue';
        program.parse(['node', 'test', '--cheese', cheeseType]);
        assert.equal(program.getOptionValue('cheese'), cheeseType);
      });

      test(`when storeOptionsAsProperties is ${storeOptionsAsProperties} and setOptionValue then value returned by opts`, () => {
        const program = new commander.Command();
        const cheeseType = 'blue';
        // Note: opts() only returns declared options when options stored as properties
        program
          .storeOptionsAsProperties(storeOptionsAsProperties)
          .option('--cheese [type]', 'cheese type')
          .setOptionValue('cheese', cheeseType);
        assert.equal(program.opts().cheese, cheeseType);
      });
    }
  });

  test('when setOptionValueWithSource then value returned by opts', () => {
    const program = new commander.Command();
    const cheeseValue = 'blue';
    program
      .option('--cheese [type]', 'cheese type')
      .setOptionValueWithSource('cheese', cheeseValue, 'cli');
    assert.equal(program.opts().cheese, cheeseValue);
  });

  test('when setOptionValueWithSource then source returned by getOptionValueSource', () => {
    const program = new commander.Command();
    program
      .option('--cheese [type]', 'cheese type')
      .setOptionValueWithSource('cheese', 'blue', 'config');
    assert.equal(program.getOptionValueSource('cheese'), 'config');
  });

  test('when option value parsed from env then option source is env', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    assert.equal(program.getOptionValueSource('foo'), 'env');
    delete process.env.BAR;
  });

  test('when option value parsed from cli then option source is cli', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse(['--foo'], { from: 'user' });
    assert.equal(program.getOptionValueSource('foo'), 'cli');
  });

  test('when setOptionValue then clears previous source', () => {
    const program = new commander.Command();
    program.option('--foo', 'description', 'default value');
    assert.equal(program.getOptionValueSource('foo'), 'default');
    program.setOptionValue('foo', 'bar');
    assert.equal(program.getOptionValueSource('foo'), undefined);
  });
});
