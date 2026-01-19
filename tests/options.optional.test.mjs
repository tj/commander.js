import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// option with optional value, no default
describe('option with optional value, no default', () => {
  test('when option not specified then value is undefined', () => {
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type');
    program.parse(['node', 'test']);
    assert.equal(program.opts().cheese, undefined);
  });

  test('when option specified then value is as specified', () => {
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type');
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    assert.equal(program.opts().cheese, cheeseType);
  });

  test('when option specified without value then value is true', () => {
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type');
    program.parse(['node', 'test', '--cheese']);
    assert.equal(program.opts().cheese, true);
  });

  test('when option specified without value and following option then value is true', () => {
    // optional options do not eat values with dashes
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type').option('--some-option');
    program.parse(['node', 'test', '--cheese', '--some-option']);
    assert.equal(program.opts().cheese, true);
  });
});

// option with optional value, with default
describe('option with optional value, with default', () => {
  test('when option not specified then value is default', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type', defaultValue);
    program.parse(['node', 'test']);
    assert.equal(program.opts().cheese, defaultValue);
  });

  test('when option specified then value is as specified', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type', defaultValue);
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    assert.equal(program.opts().cheese, cheeseType);
  });

  test('when option specified without value then value is true', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program.option('--cheese [type]', 'cheese type', defaultValue);
    program.parse(['node', 'test', '--cheese']);
    assert.equal(program.opts().cheese, true);
  });

  test('when option specified without value and preset then value is preset', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('--cheese [type]').preset('preset'));
    program.parse(['node', 'test', '--cheese']);
    assert.equal(program.opts().cheese, 'preset');
  });
});
